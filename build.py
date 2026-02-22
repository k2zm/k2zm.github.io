# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "jinja2",
#     "markdown",
# ]
# ///

import markdown
from jinja2 import Environment, FileSystemLoader

def main():
    print("Reading index.md...")
    with open('index.md', 'r', encoding='utf-8') as f:
        md_text = f.read()

    print("Converting Markdown to HTML...")
    md = markdown.Markdown(extensions=[
        'md_in_html',
        'fenced_code',
        'meta',        # YAML-like frontmatter
        'attr_list',   # Element attributes {: .class }
        'def_list',    # Definition lists
        'nl2br',       # New lines to <br> tags
        'toc'          # Table of Contents
    ], extension_configs={
        'toc': {
            'toc_depth': '2-2', # Only include <h2> tags in the TOC
        }
    })
    # Disable indented code block parsing so that indented HTML tags aren't treated as code blocks
    if 'indent' in md.parser.blockprocessors:
        md.parser.blockprocessors.deregister('indent')
    
    html_content = md.convert(md_text)

    # md.Meta is a dict mapping keys to lists of strings (e.g. {'affiliation': ['...']})
    # Extract the first element to make it easier to use in Jinja2
    meta_data = {k: v[0] if v and isinstance(v, list) else v for k, v in md.Meta.items()} if hasattr(md, 'Meta') else {}

    print("Rendering HTML with Jinja2 template...")
    # Setup Jinja2 and render template
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('template.html')
    output_html = template.render(content=html_content)

    print("Writing index.html...")
    # Write the compiled page
    with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
        f.write(output_html)

    print("Successfully built index.html!")

if __name__ == "__main__":
    main()
