#!/usr/bin/env python3
"""Secure CI/CD helper for Flux Electrique."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List

REPO_ROOT = Path(__file__).resolve().parents[1]


def _run(cmd: List[str], *, cwd: Path | None = None) -> None:
  """Run a shell command with live output and fail fast."""
  print(f"\n[cmd] {' '.join(cmd)}", flush=True)
  subprocess.run(cmd, cwd=cwd or REPO_ROOT, check=True)


def _check_tools(tools: Iterable[str]) -> None:
  missing = [tool for tool in tools if shutil.which(tool) is None]
  if missing:
    raise RuntimeError(
      "Missing required executables: " + ", ".join(missing) + ". Install them and retry."
    )


@dataclass
class PipelineConfig:
  project_id: str
  region: str
  cluster: str
  namespace: str
  artifact_repo: str
  deployment: str
  image_tag: str

  @classmethod
  def from_env(cls, *, image_tag_override: str | None = None) -> "PipelineConfig":
    required = {
      "GCP_PROJECT_ID": os.getenv("GCP_PROJECT_ID"),
      "GCP_REGION": os.getenv("GCP_REGION"),
      "GKE_CLUSTER": os.getenv("GKE_CLUSTER"),
      "GKE_NAMESPACE": os.getenv("GKE_NAMESPACE"),
      "ARTIFACT_REPOSITORY": os.getenv("ARTIFACT_REPOSITORY"),
    }
    missing = [key for key, value in required.items() if not value]
    if missing:
      raise RuntimeError(
        "Missing environment variables: " + ", ".join(missing) + "."
      )
    deployment = os.getenv("DEPLOYMENT_NAME", "flux-electrique")
    image_tag = image_tag_override or os.getenv("IMAGE_TAG") or _detect_git_sha()
    return cls(
      project_id=required["GCP_PROJECT_ID"],
      region=required["GCP_REGION"],
      cluster=required["GKE_CLUSTER"],
      namespace=required["GKE_NAMESPACE"],
      artifact_repo=required["ARTIFACT_REPOSITORY"],
      deployment=deployment,
      image_tag=image_tag,
    )

  @property
  def image_ref(self) -> str:
    return f"{self.artifact_repo}:{self.image_tag}"


def _detect_git_sha() -> str:
  try:
    result = subprocess.run(
      ["git", "rev-parse", "--short", "HEAD"],
      cwd=REPO_ROOT,
      capture_output=True,
      text=True,
      check=True,
    )
    return result.stdout.strip()
  except subprocess.CalledProcessError as exc:
    raise RuntimeError("Unable to determine git SHA; set IMAGE_TAG manually.") from exc


def cmd_local(_: argparse.Namespace) -> None:
  _check_tools(["npm", "npx"])
  _run(["npm", "install"])
  _run(["npm", "run", "lint"])
  _run(["npm", "run", "build"])
  _run(["npx", "prisma", "validate"])


def cmd_submit(args: argparse.Namespace) -> None:
  _check_tools(["gcloud"])
  cfg = PipelineConfig.from_env()
  substitutions = ",".join(
    [
      f"_IMAGE={cfg.artifact_repo}",
      f"_GKE_CLUSTER={cfg.cluster}",
      f"_GKE_REGION={cfg.region}",
      f"_GKE_NAMESPACE={cfg.namespace}",
      f"_DEPLOYMENT={cfg.deployment}",
    ]
  )
  submit_cmd = [
    "gcloud",
    "builds",
    "submit",
    "--config",
    "cloudbuild.yaml",
    "--project",
    cfg.project_id,
    "--substitutions",
    substitutions,
  ]
  if args.async_mode:
    submit_cmd.append("--async")
  _run(submit_cmd)


def cmd_deploy(args: argparse.Namespace) -> None:
  _check_tools(["gcloud", "kubectl"])
  cfg = PipelineConfig.from_env(image_tag_override=args.image_tag)
  _run(
    [
      "gcloud",
      "container",
      "clusters",
      "get-credentials",
      cfg.cluster,
      "--region",
      cfg.region,
      "--project",
      cfg.project_id,
    ]
  )
  _run(["kubectl", "apply", "-k", "k8s/"])
  _run(
    [
      "kubectl",
      "set",
      "image",
      f"deployment/{cfg.deployment}",
      f"web={cfg.image_ref}",
      "-n",
      cfg.namespace,
    ]
  )
  _run(
    [
      "kubectl",
      "rollout",
      "status",
      f"deployment/{cfg.deployment}",
      "-n",
      cfg.namespace,
      "--timeout",
      "180s",
    ]
  )


def cmd_full(args: argparse.Namespace) -> None:
  cmd_local(args)
  cmd_submit(args)
  cmd_deploy(args)


def build_parser() -> argparse.ArgumentParser:
  parser = argparse.ArgumentParser(
    description="Flux Electrique CI/CD orchestrator (Cloud Build + GKE).",
  )
  sub = parser.add_subparsers(dest="command", required=True)

  local_p = sub.add_parser("local", help="Run local checks (lint/build/prisma).")
  local_p.set_defaults(func=cmd_local)

  submit_p = sub.add_parser("submit", help="Submit Cloud Build job.")
  submit_p.add_argument(
    "--async",
    dest="async_mode",
    action="store_true",
    help="Return immediately after queuing Cloud Build.",
  )
  submit_p.set_defaults(func=cmd_submit)

  deploy_p = sub.add_parser("deploy", help="Deploy a tagged image to GKE.")
  deploy_p.add_argument(
    "--image-tag",
    dest="image_tag",
    help="Override IMAGE_TAG/commit for rollbacks.",
  )
  deploy_p.set_defaults(func=cmd_deploy)

  full_p = sub.add_parser("full", help="local -> submit -> deploy chain.")
  full_p.add_argument(
    "--async",
    dest="async_mode",
    action="store_true",
    help="Submit Cloud Build asynchronously (deploy waits for manual trigger).",
  )
  full_p.add_argument(
    "--image-tag",
    dest="image_tag",
    help="Image tag to deploy (defaults to latest commit).",
  )
  full_p.set_defaults(func=cmd_full)

  return parser


def main(argv: List[str] | None = None) -> int:
  parser = build_parser()
  args = parser.parse_args(argv)
  try:
    args.func(args)
  except KeyboardInterrupt:
    return 130
  except Exception as exc:  # noqa: BLE001 - surface error cleanly
    print(f"error: {exc}", file=sys.stderr)
    return 1
  return 0


if __name__ == "__main__":
  sys.exit(main())
