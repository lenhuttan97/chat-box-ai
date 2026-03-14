const fs = require('fs');
const path = require('path');

const prismaDir = __dirname;
const schemaFile = path.join(prismaDir, 'schema.prisma');
const modelsDir = path.join(prismaDir, 'models');

function mergePrismaFiles() {
  // Read schema.prisma - keep only datasource and generator
  let schema = fs.readFileSync(schemaFile, 'utf-8');
  
  // Remove existing models from schema (everything after datasource block)
  const datasourceMatch = schema.match(/datasource db \{[^}]+\}/);
  if (datasourceMatch) {
    schema = `generator client {
  provider = "prisma-client-js"
}

${datasourceMatch[0]}`;
  }

  // Read all model files from models directory
  const modelFiles = fs.readdirSync(modelsDir)
    .filter(file => file.endsWith('.prisma'))
    .sort(); // Sort to ensure consistent order

  // Append each model file
  for (const file of modelFiles) {
    const modelContent = fs.readFileSync(path.join(modelsDir, file), 'utf-8');
    schema += '\n\n' + modelContent;
  }

  // Write merged schema
  fs.writeFileSync(schemaFile, schema);
  console.log('✅ Merged prisma models into schema.prisma');
}

mergePrismaFiles();
