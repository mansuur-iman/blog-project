# Blog Project (Reader Frontend)

A modern blog reader frontend built with React and Vite that connects to the Blog API backend.

Users can create accounts, browse published blogs, read full articles, and interact through comments.  
This application is designed for readers and general users of the platform.

---

## Tech Stack

- React
- Vite
- React Router
- CSS Modules / Custom CSS
- Blog API Backend
- JWT Authentication

---

## Features

### Authentication

- User signup
- User login
- Role selection during signup
  - Reader
  - Author

> Author accounts are later used to access the author dashboard frontend.

---

## Blog Features

- View all published blogs
- Open and read full blog posts
- View blog metadata
- Responsive blog layout
- Dynamic routing for posts

---

## Comment System

- Add comments to blog posts
- View existing comments
- Authentication-protected interactions

---

## Backend Integration

This frontend consumes data from a shared Blog API backend that handles:

- Authentication
- Authorization
- Blog management
- Comments
- Database operations

---

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
