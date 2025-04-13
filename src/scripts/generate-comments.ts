import fs from "fs";
import path from "path";

const SCHEMA_NAME = "biribol_ecommerce";
const SCHEMA_PATH = path.resolve(__dirname, "../prisma/schema.prisma");
const OUTPUT_PATH = path.resolve(__dirname, "./comentarios_schema.sql");

type Model = {
  name: string;
  comment: string;
  fields: { name: string; comment: string }[];
};

function parsePrismaSchema(content: string): Model[] {
  const lines = content.split("\n");
  const models: Model[] = [];

  let currentModel: Model | null = null;
  let buffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Coletar documentação acima de campos ou modelos
    if (line.startsWith("///")) {
      buffer.push(line.replace("///", "").trim());
      continue;
    }

    // Detectar início de model
    if (line.startsWith("model ")) {
      const modelName = line.split(" ")[1];
      currentModel = { name: modelName, comment: buffer.join(" "), fields: [] };
      buffer = [];
      continue;
    }

    // Detectar fim do model
    if (line === "}" && currentModel) {
      models.push(currentModel);
      currentModel = null;
      continue;
    }

    // Dentro de um model: capturar campos com buffer anterior
    if (currentModel && line && !line.startsWith("@@") && !line.startsWith("//")) {
      const fieldName = line.split(/\s+/)[0];
      const fieldComment = buffer.join(" ");
      buffer = [];

      if (fieldName !== "id" || fieldComment !== "") {
        currentModel.fields.push({ name: fieldName, comment: fieldComment });
      }
    }
  }

  return models;
}

function generateSqlComments(models: Model[]): string {
  const lines: string[] = [];

  for (const model of models) {
    const table = `${SCHEMA_NAME}.${model.name.toLowerCase()}`;

    lines.push(`-- =========================`);
    lines.push(`-- TABELA: ${model.name.toLowerCase()}`);
    lines.push(`-- =========================`);
    lines.push(`COMMENT ON TABLE ${table} IS '${model.comment}';`);

    for (const field of model.fields) {
      if (field.comment) {
        lines.push(
          `COMMENT ON COLUMN ${table}.${field.name} IS '${field.comment}';`
        );
      }
    }

    lines.push(""); // espaço entre tabelas
  }

  return lines.join("\n");
}

function main() {
  const schemaContent = fs.readFileSync(SCHEMA_PATH, "utf-8");
  const models = parsePrismaSchema(schemaContent);
  const sql = generateSqlComments(models);

  fs.writeFileSync(OUTPUT_PATH, sql);
  console.log("✅ Comentários SQL gerados com SCHEMA em:", OUTPUT_PATH);
}

main();
