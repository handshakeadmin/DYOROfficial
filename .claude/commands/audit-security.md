Perform a comprehensive security audit for this e-commerce application.

1. **Authentication & Authorization**:
   - Review Supabase RLS policies in `supabase/` directory
   - Check auth flows in middleware.ts
   - Verify session handling

2. **Input Validation**:
   - Check all form inputs for sanitization
   - Review server actions for proper validation
   - Look for SQL injection vectors

3. **Data Protection**:
   - Ensure no sensitive data in client bundles
   - Check for exposed API keys or secrets
   - Review environment variable usage

4. **OWASP Top 10 Check**:
   - Injection vulnerabilities
   - Broken authentication
   - Sensitive data exposure
   - XML external entities (XXE)
   - Broken access control
   - Security misconfiguration
   - XSS vulnerabilities
   - Insecure deserialization
   - Components with known vulnerabilities
   - Insufficient logging

Report findings with severity levels (Critical, High, Medium, Low) and remediation steps.
