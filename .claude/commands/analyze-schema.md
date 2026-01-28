Analyze the Supabase database schema for this e-commerce application.

1. **Review current schema**:
   - Read migration files in `supabase/migrations/`
   - Identify all tables and relationships
   - Map foreign key constraints

2. **Check RLS policies**:
   - Verify each table has appropriate policies
   - Ensure policies cover all CRUD operations
   - Check for policy gaps or over-permissions

3. **Performance analysis**:
   - Identify missing indexes
   - Check for N+1 query patterns
   - Review query complexity

4. **Schema recommendations**:
   - Suggest missing tables for planned features
   - Recommend normalization improvements
   - Identify denormalization opportunities for performance

5. **Type safety**:
   - Check TypeScript types match schema
   - Verify Supabase client type generation

Output a schema diagram (text-based) and recommendations document.
