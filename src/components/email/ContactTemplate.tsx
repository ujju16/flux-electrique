import { formatBudgetRange, formatServiceType } from "@/lib/formatters";
import type {
  BudgetRange,
  ServiceType,
} from "../../../generated/prisma/client";

interface ContactTemplateProps {
  type: ServiceType;
  designation: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  budget: BudgetRange;
  ipAddress?: string;
}

export default function ContactTemplate({
  type,
  designation,
  name,
  email,
  phone,
  company,
  message,
  budget,
  ipAddress,
}: ContactTemplateProps) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #e6edf3;
            background: #0d1117;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 650px;
            margin: 0 auto;
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            border-bottom: 2px solid #00e5ff;
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #00e5ff;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .header p {
            margin: 8px 0 0;
            font-size: 14px;
            color: #8b949e;
            font-family: 'Courier New', monospace;
          }
          .section {
            padding: 24px;
            border-bottom: 1px solid #30363d;
          }
          .section:last-of-type {
            border-bottom: none;
          }
          .section-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: #00c853;
            letter-spacing: 0.5px;
            margin: 0 0 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .section-title::before {
            content: '';
            width: 4px;
            height: 16px;
            background: #00c853;
            border-radius: 2px;
          }
          .field {
            margin-bottom: 16px;
          }
          .field:last-child {
            margin-bottom: 0;
          }
          .field-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: #8b949e;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
          }
          .field-value {
            font-size: 15px;
            color: #e6edf3;
            padding: 10px 14px;
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            word-wrap: break-word;
          }
          .field-value.highlight {
            border-color: #00e5ff;
            background: rgba(0, 229, 255, 0.05);
            font-weight: 500;
          }
          .badge {
            display: inline-block;
            padding: 6px 12px;
            background: rgba(0, 229, 255, 0.1);
            border: 1px solid #00e5ff;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #00e5ff;
          }
          .footer {
            padding: 20px 24px;
            background: #0d1117;
            text-align: center;
            font-size: 11px;
            color: #8b949e;
            font-family: 'Courier New', monospace;
          }
          .footer .ip {
            color: #00c853;
            font-weight: 600;
          }
          .message-box {
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.8;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1>⚡ Nouvelle Demande - Flux Electrique</h1>
            <p>TECHNICAL SPECIFICATION SHEET</p>
          </div>

          {/* Section 1: Type de Service */}
          <div className="section">
            <h2 className="section-title">01. Type de Service</h2>
            <div className="field">
              <div className="field-label">Catégorie</div>
              <div className="badge">{formatServiceType(type)}</div>
            </div>
          </div>

          {/* Section 2: Définition du Besoin */}
          <div className="section">
            <h2 className="section-title">02. Définition du Besoin</h2>
            <div className="field">
              <div className="field-label">Désignation / Sujet</div>
              <div className="field-value highlight">{designation}</div>
            </div>
            <div className="field">
              <div className="field-label">Budget estimé</div>
              <div className="field-value">{formatBudgetRange(budget)}</div>
            </div>
          </div>

          {/* Section 3: Description Technique */}
          <div className="section">
            <h2 className="section-title">03. Description Technique</h2>
            <div className="field">
              <div className="field-value message-box">{message}</div>
            </div>
          </div>

          {/* Section 4: Coordonnées Client */}
          <div className="section">
            <h2 className="section-title">04. Coordonnées Client</h2>
            <div className="field">
              <div className="field-label">Nom</div>
              <div className="field-value">{name}</div>
            </div>
            <div className="field">
              <div className="field-label">Email</div>
              <div className="field-value highlight">{email}</div>
            </div>
            {phone && (
              <div className="field">
                <div className="field-label">Téléphone</div>
                <div className="field-value">{phone}</div>
              </div>
            )}
            {company && (
              <div className="field">
                <div className="field-label">Entreprise</div>
                <div className="field-value">{company}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="footer">
            <p>
              Demande reçue le{" "}
              {new Date().toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {ipAddress && (
              <p>
                IP Address: <span className="ip">{ipAddress}</span>
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
