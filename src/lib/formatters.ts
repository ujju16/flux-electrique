import type { BudgetRange, ServiceType } from "../../generated/prisma/client";

/**
 * Format ServiceType enum to human-readable French string
 */
export function formatServiceType(type: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    HARDWARE_REPAIR: "🛠️ Réparation Électronique",
    SOFTWARE_DEV: "💻 Développement Logiciel",
    DEVSECOPS_CONSULTING: "🛡️ Audit & DevOps",
    OTHER: "Autre demande",
  };
  return labels[type];
}

/**
 * Format BudgetRange enum to human-readable French string
 */
export function formatBudgetRange(budget: BudgetRange): string {
  const labels: Record<BudgetRange, string> = {
    UNKNOWN: "Non précisé",
    LESS_THAN_500: "< 500 €",
    FROM_500_TO_2K: "500 € - 2 000 €",
    FROM_2K_TO_10K: "2 000 € - 10 000 €",
    MORE_THAN_10K: "> 10 000 €",
  };
  return labels[budget];
}
