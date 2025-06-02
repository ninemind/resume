# Christopher West's Resume

This repository contains my professional resume in JSON format, which is used to generate my online resume at [ninemind.github.io/resume](https://ninemind.github.io/resume/).

## Structure

- `resume.json`: The main resume data file containing all professional information
- `index.html`: The template file for rendering the resume
- `styles.css`: Custom styling for the resume
- `script.js`: JavaScript functionality for the resume
- `package.json`: Frontend dependencies and project configuration

## Dependencies

This project uses several frontend libraries:
- Bootstrap 3.4.1 - For responsive layout and components
- Font Awesome 4.7.0 - For icons
- jQuery 3.5.0 - For DOM manipulation
- RequireJS 2.3.5 - For module loading
- Underscore 1.8.3 - For utility functions

### Installing Dependencies

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Install the dependencies:
   ```bash
   npm install
   ```

## How to Use

1. Clone this repository:
   ```bash
   git clone https://github.com/ninemind/resume.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make changes to `resume.json` to update your information:
   - Update work experience
   - Add new skills
   - Modify education details
   - Update contact information

4. The resume follows the [JSON Resume](https://jsonresume.org/) schema, which includes:
   - Basics (contact info, summary)
   - Work experience
   - Education
   - Skills
   - Awards
   - References

5. To view changes locally:
   - Open `index.html` in your browser
   - Changes will be reflected immediately

## Development

The project uses RequireJS for module management. The main entry point is `app/app.js`. To modify the JavaScript functionality:

1. Edit the appropriate module in the `app` directory
2. Changes will be automatically reflected when you refresh the page

## Deployment

The resume is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Customization

### Styling
- Modify `styles.css` to change the visual appearance
- The current theme is clean and professional, optimized for readability
- Bootstrap and Font Awesome classes can be used for additional styling

### Layout
- The layout is responsive and works well on both desktop and mobile devices
- Sections can be reordered by modifying the HTML structure in `index.html`
- Bootstrap grid system is available for custom layouts

## Contributing

Feel free to fork this repository and use it as a template for your own resume. If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).
