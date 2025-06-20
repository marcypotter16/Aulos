## Backend TODO List

### ✅ Completed
- Set up FastAPI project with SQLite
- Created `/users` POST endpoint
- Created `/search/users` GET endpoint

### 🔜 In Progress / Planned
- [ ] Implement Option 1: Preload interesting content on search page using `useEffect`
  - [ ] Create `/search/default` endpoint in FastAPI
  - [ ] Decide what qualifies as "interesting" (e.g., recent users, trending genres, etc.)
  - [ ] Connect endpoint to frontend useEffect

### 💡 Ideas for Later
- Add pagination support to `/search/users`
- Add post search: `/search/posts?q=...`
- Add trending endpoint: `/trending`
- Implement review system (musician ratings)
- Add authentication with JWT
- Use PostgreSQL in production

