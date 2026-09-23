import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECEPTEN_DIR = path.resolve(__dirname, '../Recepten');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const RECIPES_PUBLIC_DIR = path.join(PUBLIC_DIR, 'recipes');
const INDEX_FILE = path.join(PUBLIC_DIR, 'recipes_index.json');

// Ensure public/recipes directory exists
if (!fs.existsSync(RECIPES_PUBLIC_DIR)) {
  fs.mkdirSync(RECIPES_PUBLIC_DIR, { recursive: true });
}

// Function to recursively find all markdown files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (filePath.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function generateIndex() {
  console.log(`Scanning for recipes in ${RECEPTEN_DIR}...`);
  const markdownFiles = findMarkdownFiles(RECEPTEN_DIR);
  
  const recipesIndex = [];

  for (const filePath of markdownFiles) {
    const fileName = path.basename(filePath);
    
    // Skip template files
    if (fileName.toLowerCase() === 'template.md' || fileName.startsWith('_')) {
      continue;
    }

    try {
      let fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Fix Obsidian's unquoted `#` in tags array (which breaks standard YAML parsers)
      // Example: tags: [#recept/taart, #recept/kokos] -> tags: ["#recept/taart", "#recept/kokos"]
      fileContent = fileContent.replace(/tags:\s*\[(.*?)\]/g, (match, tagsInner) => {
        const quotedTags = tagsInner.split(',').map(t => {
          const trimmed = t.trim();
          if (trimmed.startsWith('"') || trimmed.startsWith("'")) return trimmed;
          return `"${trimmed}"`;
        }).join(', ');
        return `tags: [${quotedTags}]`;
      });

      const parsed = matter(fileContent);
      
      // We will copy the file to public/recipes, keeping a flat structure for simplicity 
      // or we can keep the folder structure. Let's keep the folder structure for organization.
      const relativePath = path.relative(RECEPTEN_DIR, filePath);
      const destPath = path.join(RECIPES_PUBLIC_DIR, relativePath);
      
      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Copy the file
      fs.copyFileSync(filePath, destPath);

      // Create index entry
      const cleanRelativePath = relativePath.replace(/\\/g, '/');
      const slug = cleanRelativePath.replace(/\.md$/, '');
      const urlPath = `/recipes/${cleanRelativePath}`;
      
      recipesIndex.push({
        id: slug,
        slug: slug,
        title: parsed.data.title || fileName.replace('.md', ''),
        category: parsed.data.category || '',
        cuisine: parsed.data.cuisine || '',
        difficulty: parsed.data.difficulty || '',
        time: parsed.data.time || '',
        portions: parsed.data.portions || parsed.data.servings || parsed.data.personen || '',
        dietary: parsed.data.dietary || [],
        tags: parsed.data.tags || [],
        url: urlPath,
        content: parsed.content // Including content for full-text search
      });
      
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err);
    }
  }

  // Write the index to public/recipes_index.json
  fs.writeFileSync(INDEX_FILE, JSON.stringify(recipesIndex, null, 2));
  console.log(`Successfully generated index with ${recipesIndex.length} recipes.`);
}

generateIndex();
