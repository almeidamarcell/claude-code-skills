# Entire Skill - Usage Examples

This document shows practical examples of how the `/entire` skill works in real-world scenarios.

## Example 1: Initial Setup

### User Request
```
User: "Can you set up Entire for me? I want to track my AI sessions."
```

### Skill Response (Claude with /entire)

```markdown
I'll help you install and enable Entire in this repository.

First, let me check if Entire is already installed:
```

```bash
which entire
# Output: (empty - not installed)
```

```markdown
Entire is not installed. I'll install it via Homebrew:
```

```bash
brew tap entireio/tap
brew install entireio/tap/entire
```

```markdown
Now let's enable Entire in your repository:
```

```bash
cd /path/to/your/repo
entire enable
```

```markdown
✓ Entire has been enabled with the manual-commit strategy!

Here's what was set up:
- **Strategy:** manual-commit (checkpoints created when you commit)
- **Agent:** claude-code
- **Configuration:** `.entire/settings.json` created

Let me verify everything is working:
```

```bash
entire status
```

```markdown
Output:
```
Strategy: manual-commit
Agent: claude-code
Enabled: true
Current Session: No active session
Checkpoints: 0
```

Perfect! Entire is now tracking your AI sessions. Here's how it works:

1. **Work normally** - Use Claude Code as usual
2. **Make commits** - Checkpoints are created automatically when you commit
3. **Rewind if needed** - Use `entire rewind` to restore previous states
4. **Check status** - Run `entire status` anytime to see your session

You can start working now, and I'll create checkpoints as we go!
```

---

## Example 2: Recovering from Breaking Changes

### User Request
```
User: "Oh no, the changes you just made broke my authentication system.
The login page is completely broken now. Can we go back?"
```

### Skill Response (Claude with /entire)

```markdown
I understand - let's rewind to before those authentication changes.
Let me check your available checkpoints:
```

```bash
entire status
```

```markdown
Current Session: 2026-02-11-abc123de-f456-7890-abcd-ef1234567890
Checkpoints: 4
```

```markdown
Great, we have 4 checkpoints. Let's see what's available:
```

```bash
entire rewind
```

```markdown
[Interactive output shows:]

Available checkpoints:
1. a3b2c4d5e6f7 - 2026-02-11 14:35 - "Update authentication flow"  ← Current
2. f9e8d7c6b5a4 - 2026-02-11 14:23 - "Add login validation"
3. 1a2b3c4d5e6f - 2026-02-11 14:15 - "Initial auth setup"
4. 9g8h7i6j5k4l - 2026-02-11 14:00 - "Create user model"

Select checkpoint to rewind to: _

I recommend selecting checkpoint **2 or 3** - either:
- **#2** (Add login validation) - Goes back to before the breaking changes
- **#3** (Initial auth setup) - Goes back to the original working auth

Which would you prefer? Or you can select a different checkpoint if you know exactly where you want to go.
```

### User Follow-up
```
User: "Let's go to #2, the login validation one"
```

### Skill Continues

```markdown
Perfect choice. Rewinding to checkpoint #2 ("Add login validation"):
```

```bash
# [User selects #2 in the interactive prompt]
```

```markdown
✓ Successfully restored to checkpoint f9e8d7c6b5a4

Your code has been restored to the state before the breaking changes:
- Authentication flow reverted
- Login page should be working again
- All files restored to checkpoint state

**What was changed:**
- src/auth/login.tsx (restored)
- src/auth/validation.ts (restored)
- src/api/auth-routes.ts (restored)

**Important:** This rewind is non-destructive. If you want to see those changes again,
we can rewind forward to checkpoint #1.

Would you like me to verify the login page is working now?
```

---

## Example 3: Understanding How Code Was Created

### User Request
```
User: "I'm looking at this payment processor code and I'm not sure why it's
implemented this way. Can you show me how it was created?"
```

### Skill Response (Claude with /entire)

```markdown
I can show you the full session that created this payment processor.
Let me explain the development history:
```

```bash
entire explain src/payment/processor.ts
```

```markdown
Session: 2026-02-10-def456gh-i789-0123-jklm-no4567890123
Date: 2026-02-10 13:45 - 15:20 (1h 35m)
Strategy: manual-commit
Checkpoints: 7

**Session Timeline:**

**Checkpoint 1** (13:45) - Initial Setup
User: "We need to integrate Stripe payments. Create a payment processor."
Claude: I'll create a payment processor with:
- Stripe SDK integration
- Basic charge creation
- Error handling
Files: src/payment/processor.ts (created)

**Checkpoint 2** (13:58) - Retry Logic
User: "Add retry logic for failed payments"
Claude: I'll implement exponential backoff retry:
- 3 retry attempts
- Exponential backoff (1s, 2s, 4s)
- Preserves original error if all retries fail
Files: src/payment/processor.ts (modified)

**Checkpoint 3** (14:15) - Idempotency
User: "We need idempotency to prevent duplicate charges"
Claude: Adding idempotency key generation:
- UUID-based idempotency keys
- Stored per transaction
- Prevents duplicate charges if retry occurs
Files: src/payment/processor.ts (modified)
       src/payment/types.ts (created)

**Checkpoint 4** (14:32) - Webhook Handling
User: "Add webhook handling for payment confirmations"
Claude: Creating webhook endpoint:
- Signature verification
- Event type handling
- Database updates on success
Files: src/payment/webhooks.ts (created)
       src/api/routes.ts (modified)

**Checkpoint 5** (14:50) - Error Categorization
User: "Can we categorize errors better? Network vs validation vs rate limiting"
Claude: Implementing error categorization:
- NetworkError, ValidationError, RateLimitError classes
- Different retry strategies per error type
- Better error messages for debugging
Files: src/payment/errors.ts (created)
       src/payment/processor.ts (modified)

**Checkpoint 6** (15:05) - Testing
User: "Add unit tests"
Claude: Creating comprehensive test suite:
- Success cases
- Retry scenarios
- Error handling
- Idempotency validation
Files: src/payment/processor.test.ts (created)

**Checkpoint 7** (15:20) - Documentation
User: "Add JSDoc comments"
Claude: Adding documentation:
- Function signatures
- Parameter descriptions
- Return types and error conditions
- Usage examples
Files: src/payment/processor.ts (modified)

**Key Design Decisions:**

1. **Why exponential backoff?** - Network issues are often transient.
   Exponential backoff gives the service time to recover.

2. **Why idempotency keys?** - Prevents duplicate charges if a retry occurs
   after a successful-but-slow payment.

3. **Why error categorization?** - Different errors need different handling:
   - Network errors → retry
   - Validation errors → fail fast
   - Rate limit errors → backoff longer

4. **Why webhook verification?** - Security requirement from Stripe to
   ensure webhooks are genuine.

The implementation evolved through 7 checkpoints over ~1.5 hours, with each
checkpoint adding a specific piece of functionality based on your requirements.

Would you like me to explain any specific part in more detail?
```

---

## Example 4: Resuming Work on Different Branch

### User Request
```
User: "I need to switch to the feature/payment-ui branch and continue
where I left off yesterday"
```

### Skill Response (Claude with /entire)

```markdown
I'll help you resume your work on the feature/payment-ui branch:
```

```bash
entire resume feature/payment-ui
```

```markdown
Checked out branch 'feature/payment-ui'
Restored session: 2026-02-10-payment-ui-session
Last checkpoint: c5d6e7f8g9h0 (2026-02-10 17:45)

**Session Summary:**
- Working on: Payment UI components
- Last task: Implementing card input validation
- Files in progress:
  - src/components/PaymentForm.tsx
  - src/components/CardInput.tsx
  - src/utils/validation.ts

**To continue:**
```

```bash
claude code continue
```

```markdown
Your session has been restored! Here's where we left off:

**Yesterday's Progress:**
1. ✓ Created PaymentForm component
2. ✓ Added Stripe Elements integration
3. ✓ Implemented basic card input
4. 🔄 **In progress:** Card validation (last checkpoint)

**Next Steps:**
- Complete card validation logic
- Add error messaging
- Style the payment form
- Add loading states

Would you like to continue with the card validation, or should we work
on something else first?
```

---

## Example 5: Debugging Stuck Session

### User Request
```
User: "Entire is acting weird. It says I have a session but when I check
status it shows 0 checkpoints. And I can't rewind."
```

### Skill Response (Claude with /entire)

```markdown
That sounds like a stuck session. Let me diagnose this with Entire's doctor command:
```

```bash
entire doctor
```

```markdown
Diagnosing Entire state...

**Issues Found:**
✗ Orphaned session state detected
  - Session ID: 2026-02-11-orphaned-session
  - No corresponding shadow branch found

✗ Shadow branch missing for current HEAD
  - Expected: entire/a1b2c3d-abc123
  - Found: none

✓ Configuration valid
✓ Git hooks installed correctly
✓ Repository structure intact

**Root Cause:**
It looks like the shadow branch was deleted (possibly during a git operation
like rebase or reset), but the session state file remained. This creates an
inconsistency.

**Recommended Fixes:**
1. Clean orphaned session data
2. Reset shadow branch for current HEAD
3. Re-enable Entire

Apply these fixes? [y/n]: _

I recommend accepting the fixes. Here's what will happen:

1. **Clean orphaned data** - Removes the disconnected session state
2. **Reset shadow branch** - Creates a fresh shadow branch for your current HEAD
3. **Preserve committed checkpoints** - Your `entire/checkpoints/v1` data is safe

This is safe and won't affect your code or git history.
```

### User Follow-up
```
User: "Yes, go ahead and fix it"
```

### Skill Continues

```markdown
Applying fixes:
```

```bash
# [User confirms in the doctor prompt]
```

```markdown
Cleaning orphaned session data...
✓ Removed orphaned session: 2026-02-11-orphaned-session

Resetting shadow branch...
✓ Created fresh shadow branch: entire/a1b2c3d-abc123

Verifying Entire state...
✓ All checks passed

**Fix Summary:**
- Removed 1 orphaned session
- Created new shadow branch
- Session tracking ready

Let's verify everything is working:
```

```bash
entire status
```

```markdown
Strategy: manual-commit
Agent: claude-code
Enabled: true
Current Session: No active session
Checkpoints: 0

Perfect! Entire is now healthy and ready to track sessions.

**What happened:** When you did a git operation (likely rebase or reset),
the shadow branch was removed but the session state file wasn't cleaned up.
The doctor command detected this inconsistency and fixed it.

**Going forward:**
- Work normally - new checkpoints will be created
- Committed checkpoints on `entire/checkpoints/v1` are still available
- If you see this again after complex git operations, run `entire doctor`

You're all set! Would you like to continue working?
```

---

## Example 6: Switching to Auto-Commit Strategy

### User Request
```
User: "I want Entire to automatically commit after each of your responses
instead of waiting for me to commit. How do I do that?"
```

### Skill Response (Claude with /entire)

```markdown
I can help you switch to the auto-commit strategy. This will create git commits
automatically after each of my responses.

**⚠️ Important Considerations:**

**Auto-commit strategy means:**
- ✓ Automatic code commits on your active branch
- ✓ Checkpoint created after each agent response
- ✓ Easy to rewind between individual responses
- ⚠️ Use caution on main/master branches (creates commits)
- ⚠️ Commit messages are generic (e.g., "Entire checkpoint a3b2c4d5e6f7")

**When to use auto-commit:**
- Feature branches where automatic commits are okay
- Teams that want every agent response committed
- Workflows where granular history is valuable

**When to keep manual-commit:**
- Main/master branches (keeps history clean)
- When you want control over commit messages
- When you prefer fewer, meaningful commits

**Current setup:**
```

```bash
entire status
```

```markdown
Strategy: manual-commit
```

```markdown
To switch to auto-commit:
```

```bash
# Disable current setup
entire disable

# Re-enable with auto-commit strategy
entire enable --strategy auto-commit

# Verify
entire status
```

```markdown
Expected output:
```
Strategy: auto-commit
Agent: claude-code
Enabled: true
```

Should I proceed with switching to auto-commit? Or would you like to stick
with manual-commit on this repository?
```

### User Follow-up
```
User: "Yes, switch to auto-commit. This is a feature branch so it's fine."
```

### Skill Continues

```markdown
Perfect! Since this is a feature branch, auto-commit is a good choice.
Switching now:
```

```bash
entire disable
entire enable --strategy auto-commit
entire status
```

```markdown
✓ Switched to auto-commit strategy!

**What changed:**
- Checkpoints now created after each agent response
- Code automatically committed to your branch
- Commit messages: "Entire checkpoint <checkpoint-id>"

**What stayed the same:**
- Session metadata still on `entire/checkpoints/v1` branch
- Rewind still works the same way
- All committed checkpoints preserved

**Next steps:**
- Work normally with Claude Code
- After each response, a commit is created automatically
- Use `entire rewind` anytime to restore previous states
- Check `git log` to see automatic commits

Let's continue working! I'll create automatic commits from now on.
```

---

## Example 7: Exploring Session History

### User Request
```
User: "Can you show me all the sessions where we worked on the authentication system?"
```

### Skill Response (Claude with /entire)

```markdown
I'll search through your Entire session history for authentication-related work:
```

```bash
# List sessions from the checkpoints branch
git log entire/checkpoints/v1 --oneline --all | grep -i auth
```

```markdown
Found authentication-related sessions:
```
a3b2c4d Add authentication session checkpoint
f9e8d7c Auth validation improvements
1a2b3c4 Initial auth setup
```

Let me get more details on these sessions:
```

```bash
entire explain --help
```

```markdown
Now I'll explain each authentication session:

**Session 1: Initial Auth Setup**
```

```bash
entire explain 1a2b3c4
```

```markdown
Session: 2026-02-09-initial-auth-setup
Date: 2026-02-09 10:00 - 11:30

**Summary:** Created basic authentication system
- JWT token generation
- Login/logout endpoints
- Password hashing with bcrypt
- User model with auth fields

Files created:
- src/auth/jwt.ts
- src/auth/password.ts
- src/models/User.ts
- src/api/auth.ts

**Session 2: Auth Validation Improvements**
```

```bash
entire explain f9e8d7c
```

```markdown
Session: 2026-02-10-auth-validation
Date: 2026-02-10 14:00 - 15:15

**Summary:** Enhanced validation and security
- Email format validation
- Password strength requirements
- Rate limiting on login attempts
- Session expiry handling

Files modified:
- src/auth/validation.ts
- src/middleware/rateLimit.ts
- src/auth/jwt.ts

**Session 3: Add Authentication Session Checkpoint**
```

```bash
entire explain a3b2c4d
```

```markdown
Session: 2026-02-11-auth-updates
Date: 2026-02-11 09:30 - 10:45

**Summary:** Updated authentication flow
- Added OAuth integration (Google, GitHub)
- Improved error messages
- Added password reset flow
- Two-factor authentication setup

Files modified:
- src/auth/oauth.ts (created)
- src/auth/twoFactor.ts (created)
- src/api/auth.ts
- src/components/LoginForm.tsx

**Authentication Development Timeline:**

```
Feb 9: Initial Setup → Feb 10: Validation → Feb 11: OAuth & 2FA
  │                       │                      │
  ├─ JWT & passwords      ├─ Validation         ├─ OAuth
  ├─ Login/logout         ├─ Rate limiting      ├─ 2FA
  └─ User model           └─ Security           └─ Password reset
```

**Key Evolution:**
1. **Day 1:** Basic username/password auth
2. **Day 2:** Security hardening and validation
3. **Day 3:** Modern auth features (OAuth, 2FA)

Would you like me to dive deeper into any of these sessions, or explain
specific implementation details?
```

---

## Testing the Skill

To test this skill yourself:

1. **Invoke the skill:**
   ```
   /entire
   ```

2. **Try these test scenarios:**
   - "Set up Entire for me"
   - "I want to rewind to before these changes"
   - "How was this file created?"
   - "Switch to the feature branch and resume work"
   - "Entire is showing errors, can you fix it?"

3. **Verify the skill:**
   - Provides step-by-step guidance
   - Explains commands clearly
   - Interprets output correctly
   - Suggests next actions
   - Handles errors gracefully

---

## Notes

These examples demonstrate:
- ✅ Clear explanation of Entire concepts
- ✅ Step-by-step command guidance
- ✅ Output interpretation
- ✅ Proactive suggestions
- ✅ Troubleshooting workflows
- ✅ Strategy awareness
- ✅ Session history exploration

The skill is designed to make Entire a natural part of the Claude Code workflow!