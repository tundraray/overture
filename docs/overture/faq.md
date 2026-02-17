# FAQ

**Q: Which plugin should I install?**

A: Depends on what you're building:
- **Node.js backend, APIs, CLI tools** -- Install `backend-overture`
- **React/TypeScript frontend** -- Install `frontend-overture`
- **Full-stack projects** -- Install `fullstack-overture` (or both backend + frontend separately)
- **Games with Phaser 3** -- Install `gamedev-overture`

**Q: Can I use both plugins at the same time?**

A: Yes! They're designed to work together. Install both if you're building a full-stack app.

**Q: Do I need to learn special commands?**

A: Not really. For backend, just use `/implement`. For frontend, use `/front-design`. For gamedev, use `/implement` (it detects game context automatically). The plugins handle everything else automatically.

**Q: How does the gamedev plugin differ from backend?**

A: The gamedev plugin uses game-specific agents and workflows:
- Replaces PRD with GDD (Game Design Document) + Market Analysis
- Adds 12 game-specialized agents (designers, artists, mechanics engineer, QA, analytics)
- Uses 6-phase planning (Core Mechanics → Game Feel → Art → UI → Analytics → QA) instead of generic 4-phase
- Supports three development modes: Full Development, Design Only (docs only), and Prototype (rapid core loop)
- Detects new project vs existing project and adjusts the flow accordingly

**Q: What if there are errors?**

A: The quality-fixer agents (one in each plugin) automatically fix most issues like test failures, type errors, and lint problems. If something can't be auto-fixed, you'll get clear guidance on what needs attention.

**Q: SSH authentication error during plugin installation?**

A: Set up SSH keys for GitHub:

```bash
# 1. Check if SSH key already exists
ls ~/.ssh/id_ed25519.pub

# 2. Generate new SSH key (if needed)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to save to default location
# Enter a strong passphrase when prompted (recommended for security)

# 3. Add SSH key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 4. Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub
# Copy the output

# 5. Add to GitHub
# Go to https://github.com/settings/keys
# Click "New SSH key"
# Paste your public key and save

# 6. Test connection
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated..."
```
