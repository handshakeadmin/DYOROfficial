Generate and update TypeScript types for the application.

1. **Supabase Types**:
   - Run `npx supabase gen types typescript` if CLI available
   - Otherwise, manually create types from schema
   - Update `src/types/database.ts` or equivalent

2. **API Types**:
   - Define request/response types for all endpoints
   - Create shared types for client and server
   - Ensure strict typing (no `any`)

3. **Component Props**:
   - Review React component prop types
   - Add missing prop interfaces
   - Ensure children types are correct

4. **Form Types**:
   - Define form data structures
   - Add validation schema types (Zod if used)
   - Type form handlers

5. **State Types**:
   - Define context state shapes
   - Type reducer actions
   - Add cart/wishlist item types

Ensure all types are exported and properly organized.
