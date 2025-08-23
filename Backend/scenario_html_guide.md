# Scenario HTML Content Guide

## Overview
Scenario descriptions now support rich HTML content with consistent CSS styling. This allows you to create engaging, structured content with images, links, code blocks, and more.

## Available HTML Elements

### Headings
```html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<h4>Minor Section</h4>
```

### Text Formatting
```html
<p>Regular paragraph text</p>
<strong>Bold text</strong>
<em>Italic text</em>
<code>inline code</code>
```

### Lists
```html
<ul>
  <li>Unordered list item</li>
  <li>Another item</li>
</ul>

<ol>
  <li>Ordered list item</li>
  <li>Second item</li>
</ol>
```

### Links
```html
<a href="https://example.com" target="_blank">External Link</a>
<a href="/internal-page">Internal Link</a>
```

### Images
```html
<img src="https://example.com/image.png" alt="Description" />
<img src="/local-image.jpg" alt="Local Image" />
```

### Code Blocks
```html
<pre><code>// Multi-line code block
function example() {
  return "Hello World";
}</code></pre>
```

### Special Styled Boxes
```html
<div class="warning">
  <strong>⚠️ WARNING:</strong> Important warning message
</div>

<div class="info">
  <strong>💡 TIP:</strong> Helpful information
</div>

<div class="success">
  <strong>✅ SUCCESS:</strong> Success message
</div>

<div class="note">
  <strong>📝 NOTE:</strong> General note
</div>

<div class="step">
  <strong>🔧 STEP:</strong> Step-by-step instruction
</div>
```

### Tables
```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### Horizontal Rules
```html
<hr />
```

### Blockquotes
```html
<blockquote>
  This is a quoted text block
</blockquote>
```

## Example Scenario Description

```html
<h2>Web Application Security Challenge</h2>

<p>You are a <strong>security researcher</strong> testing a web application for vulnerabilities. Your goal is to identify and exploit security weaknesses to gain unauthorized access.</p>

<h3>SCENARIO DETAILS:</h3>
<ul>
  <li><strong>Target:</strong> <code>https://vulnerable-app.com</code></li>
  <li><strong>Scope:</strong> Login and user management pages</li>
  <li><strong>Goal:</strong> Access admin panel</li>
</ul>

<div class="warning">
  <strong>⚠️ WARNING:</strong> This is a controlled environment for educational purposes only.
</div>

<h3>Your Tasks:</h3>
<ol>
  <li>Reconnaissance and enumeration</li>
  <li>Identify injection vulnerabilities</li>
  <li>Exploit authentication bypass</li>
  <li>Document your findings</li>
</ol>

<div class="info">
  <strong>💡 TIP:</strong> Start with basic enumeration techniques before attempting exploits.
</div>

<p>Use the <em>Download Task Files</em> button to get the necessary tools and documentation.</p>
```

## CSS Classes Available

All HTML elements are automatically styled with the `.scenario-content` class. Additional utility classes include:

- `.warning` - Red warning box
- `.info` - Blue information box  
- `.success` - Green success box
- `.note` - Yellow note box
- `.step` - Blue step box
- `.task-list` - Dark task list container
- `.code-block` - Code block container
- `.highlight` - Highlighted text

## Best Practices

1. **Use semantic HTML** - Choose appropriate tags for content structure
2. **Keep it readable** - Don't overuse complex HTML structures
3. **Test your content** - Preview how it looks in the application
4. **Use CSS classes** - Leverage the built-in styling system
5. **Include alt text** - Always provide alt attributes for images
6. **Validate HTML** - Ensure your HTML is well-formed

## Security Notes

- HTML content is rendered using `dangerouslySetInnerHTML`
- Only trusted content should be inserted
- Avoid including JavaScript or other executable code
- External images should use HTTPS URLs
- Links should open in new tabs when appropriate
