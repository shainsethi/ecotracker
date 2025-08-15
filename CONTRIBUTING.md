# 🤝 Contributing to EcoTracker

Thank you for your interest in contributing to EcoTracker! We're excited to have you on board. This document provides guidelines and information for contributors.

## 🎯 How Can I Contribute?

### 🐛 **Report Bugs**
- Use the [GitHub Issues](https://github.com/yourusername/ecotracker/issues) page
- Include detailed steps to reproduce the bug
- Add screenshots or error messages if applicable
- Specify your browser, OS, and device information

### 💡 **Suggest Features**
- Open a new issue with the "enhancement" label
- Describe the feature and its benefits
- Include mockups or examples if possible
- Discuss implementation approaches

### 🔧 **Fix Issues**
- Check the [Issues](https://github.com/yourusername/ecotracker/issues) page
- Look for issues labeled "good first issue" or "help wanted"
- Comment on issues you'd like to work on
- Fork the repository and create a feature branch

### 📚 **Improve Documentation**
- Fix typos or unclear explanations
- Add missing examples or use cases
- Improve code comments
- Update README sections

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Git
- Basic knowledge of React, Node.js, and MongoDB

### **Setup Development Environment**

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/yourusername/ecotracker.git
   cd ecotracker
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/originalusername/ecotracker.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

4. **Create environment files**
   - Copy `.env.example` to `.env` (if available)
   - Set up your local development environment

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### **Branch Naming Convention**
- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring

### **Commit Message Format**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(auth): add OAuth2 login support
fix(maps): resolve Google Maps loading issue
docs(readme): update installation instructions
```

### **Pull Request Process**

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, well-commented code
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(auth): add OAuth2 login support"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select the base branch (usually `main`)
   - Fill out the PR template
   - Request review from maintainers

## 🧪 Testing Guidelines

### **Frontend Testing**
- Write unit tests for components
- Test user interactions and state changes
- Ensure responsive design works on different screen sizes
- Test accessibility features

### **Backend Testing**
- Test API endpoints with different inputs
- Verify error handling and validation
- Test database operations
- Ensure security measures work correctly

### **Integration Testing**
- Test frontend-backend communication
- Verify API responses are handled correctly
- Test authentication flow end-to-end

## 📋 Code Standards

### **JavaScript/TypeScript**
- Use ES6+ features
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### **React Components**
- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper prop types or TypeScript interfaces
- Implement error boundaries where appropriate

### **CSS/Styling**
- Follow Tailwind CSS utility-first approach
- Use consistent spacing and color schemes
- Ensure responsive design principles
- Maintain accessibility standards

### **Backend Code**
- Follow Express.js best practices
- Implement proper error handling
- Use middleware for common functionality
- Validate input data thoroughly

## 🔒 Security Considerations

- Never commit sensitive information (API keys, passwords)
- Validate all user inputs
- Implement proper authentication and authorization
- Use HTTPS in production
- Follow OWASP security guidelines

## 📖 Documentation Standards

- Write clear, concise descriptions
- Include code examples where helpful
- Use consistent formatting and structure
- Keep documentation up-to-date with code changes

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub repository contributors
- Release notes for significant contributions
- Project documentation

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Request Reviews**: For code-specific feedback
- **Email**: support@ecotracker.com

## 🚀 Quick Contribution Ideas

- Add new recycling center categories
- Implement dark/light theme toggle
- Add more environmental impact metrics
- Create mobile app version
- Add internationalization support
- Implement push notifications
- Add data export functionality
- Create admin dashboard improvements

---

Thank you for contributing to EcoTracker! Your efforts help make the world a more sustainable place. 🌱
