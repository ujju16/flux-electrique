## 📋 Description

<!-- Provide a clear summary of the changes -->

**Ticket**: Closes #FLX-XXX

### Changes Made
<!-- List the main changes in bullet points -->
- 
- 

### Type of Change
<!-- Mark the relevant option with an 'x' -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🔧 Configuration change (CI/CD, build, dependencies)
- [ ] ♻️ Refactoring (no functional changes)

---

## 🧪 Testing Evidence

<!-- Describe how you tested this change -->

### Manual Testing
- [ ] Tested locally in development mode
- [ ] Tested production build (`npm run build && npm start`)
- [ ] Tested with production-like database

### Screenshots/Logs
<!-- Attach screenshots or relevant logs if applicable -->

---

## ✅ Pre-Merge Checklist

- [ ] Code follows Biome style guide (`npm run lint` passes)
- [ ] TypeScript compiles without errors
- [ ] Prisma schema validated (if DB changes made)
- [ ] No secrets or credentials committed
- [ ] Documentation updated (`README.md` or `doc/`)
- [ ] Acceptance criteria from ticket met
- [ ] Trivy scan passes (no HIGH/CRITICAL vulnerabilities)

---

## 📦 Deployment Notes

<!-- Any special instructions for deployment? Database migrations? Environment variables? -->

- [ ] No deployment steps required
- [ ] Database migration required (run `npx prisma migrate deploy`)
- [ ] New environment variables needed (documented in `.env.example`)
- [ ] Requires infrastructure changes (GKE resources, secrets)

---

## 🔗 Related Issues/PRs

<!-- Link any related issues or pull requests -->

- Related to #
- Depends on #
- Blocks #

---

## 📸 Demo

<!-- If this is a user-facing change, provide a quick demo or explanation -->

**Before:**  


**After:**  
