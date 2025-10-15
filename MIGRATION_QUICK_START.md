# Quick Start - Apply Database Migration

## You Need To Run This Migration! 🚀

Your database currently **does NOT have** the `project_description` and `reference_images` columns.  
The frontend form is ready, but the backend database needs to be updated.

---

## ⚡ Quick Migration (Choose One)

### Option 1: Automated Script (RECOMMENDED)
```bash
cd backend
python add_description_columns.py
```

### Option 2: Manual SQL
```sql
ALTER TABLE applications ADD COLUMN project_description TEXT;
ALTER TABLE applications ADD COLUMN reference_images TEXT;
```

---

## ✅ What This Does

- Adds `project_description` column (TEXT) to store detailed project info
- Adds `reference_images` column (TEXT) to store image URLs or references
- **Keeps all existing data safe** - no data loss
- Existing applications will have NULL for these new fields

---

## 🎯 After Migration

1. **Restart your backend server**:
   ```bash
   cd backend
   python app.py
   ```

2. **Test the form**:
   - Go to `/apply` page
   - Fill out all fields including project description
   - Submit and check admin dashboard

3. **Verify admin dashboard**:
   - Login as admin
   - Check that new applications show description and images
   - Test the "View Details" modal

---

## 📝 What's New

### For Users:
- Must provide detailed project description (up to 10,000 words)
- Can optionally add reference image URLs
- Real-time word counter
- Better project scoping

### For Admin:
- See full project descriptions in dashboard
- View reference materials if provided
- Better understanding of client needs
- More informed accept/reject decisions

---

## ⚠️ Important Notes

- **Existing applications**: Will still work, but won't have description/images
- **New submissions**: MUST include project description (required field)
- **Reference images**: Always optional
- **No downtime**: Migration is fast and safe

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the full guide: `DATABASE_MIGRATION_GUIDE.md`
2. Verify your database connection in `backend/config.py`
3. Make sure PostgreSQL is running
4. Check backend logs for specific errors

---

**Ready to migrate? Just run:**
```bash
cd backend
python add_description_columns.py
```

That's it! 🎉
