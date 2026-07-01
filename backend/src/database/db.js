const fs = require("fs");
const path = require("path");
const {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
} = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

let firestore = null;

const initializeFirestore = () => {
  if (firestore) {
    return firestore;
  }

  if (!getApps().length) {
    try {
      const serviceAccountPath = path.join(
        __dirname,
        "..",
        "..",
        "serviceAccount.json",
      );

      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        initializeApp({
          credential: cert(serviceAccount),
        });
      } else if (
        process.env.FIREBASE_PROJECT_ID ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT
      ) {
        initializeApp({
          credential: applicationDefault(),
        });
      } else {
        console.warn("Firestore não configurado. Pulando conexão com o banco.");
        return null;
      }
    } catch (error) {
      console.warn("Firestore indisponível:", error.message);
      return null;
    }
  }

  try {
    firestore = getFirestore();
    return firestore;
  } catch (error) {
    console.warn("Erro ao inicializar Firestore:", error.message);
    return null;
  }
};

firestore = initializeFirestore();

const normalizeDoc = (doc) => ({
  id: doc.id,
  ...doc.data(),
});

const getCollection = (collectionName) => {
  const db = initializeFirestore();
  if (!db) {
    return null;
  }

  return db.collection(collectionName);
};

const buildQuery = (collectionName, options = {}) => {
  let query = getCollection(collectionName);

  if (options.where) {
    options.where.forEach(([field, operator, value]) => {
      query = query.where(field, operator, value);
    });
  }

  if (options.orderBy) {
    query = query.orderBy(
      options.orderBy.field,
      options.orderBy.direction || "asc",
    );
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
};

const getAll = async (collectionName, options = {}) => {
  const collection = getCollection(collectionName);
  if (!collection) {
    return [];
  }

  try {
    const snapshot = await buildQuery(collectionName, options).get();
    return snapshot.docs.map(normalizeDoc);
  } catch (error) {
    console.warn(`Erro ao buscar coleção ${collectionName}:`, error.message);
    return [];
  }
};

const getById = async (collectionName, id) => {
  const collection = getCollection(collectionName);
  if (!collection) {
    return null;
  }

  try {
    const snapshot = await collection.doc(id).get();
    return snapshot.exists ? normalizeDoc(snapshot) : null;
  } catch (error) {
    console.warn(
      `Erro ao buscar documento ${id} em ${collectionName}:`,
      error.message,
    );
    return null;
  }
};

const getByField = async (collectionName, field, value) => {
  const collection = getCollection(collectionName);
  if (!collection) {
    return null;
  }

  try {
    const snapshot = await collection.where(field, "==", value).limit(1).get();
    return snapshot.empty ? null : normalizeDoc(snapshot.docs[0]);
  } catch (error) {
    console.warn(
      `Erro ao buscar por campo em ${collectionName}:`,
      error.message,
    );
    return null;
  }
};

const query = async (collectionName, options = {}) => {
  return getAll(collectionName, options);
};

const create = async (collectionName, data, idField = null) => {
  const reference = getCollection(collectionName);
  const generatedId = `${collectionName}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
  const documentId =
    idField && data[idField] ? String(data[idField]) : generatedId;

  const payload = {
    ...data,
    ...(idField ? { [idField]: documentId } : {}),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!reference) {
    return { id: documentId, ...payload };
  }

  try {
    await reference.doc(documentId).set(payload);
    return { id: documentId, ...payload };
  } catch (error) {
    console.warn(
      `Erro ao criar documento em ${collectionName}:`,
      error.message,
    );
    return { id: documentId, ...payload };
  }
};

const update = async (collectionName, id, data) => {
  const payload = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const collection = getCollection(collectionName);
  if (!collection) {
    return { id, ...payload };
  }

  try {
    await collection.doc(id).update(payload);
    return { id, ...payload };
  } catch (error) {
    console.warn(
      `Erro ao atualizar documento ${id} em ${collectionName}:`,
      error.message,
    );
    return { id, ...payload };
  }
};

const updateByField = async (collectionName, field, value, data) => {
  const existing = await getByField(collectionName, field, value);

  if (!existing) {
    return null;
  }

  const payload = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const collection = getCollection(collectionName);
  if (!collection) {
    return { id: existing.id, ...existing, ...payload };
  }

  try {
    await collection.doc(existing.id).update(payload);
    return { id: existing.id, ...existing, ...payload };
  } catch (error) {
    console.warn(
      `Erro ao atualizar por campo em ${collectionName}:`,
      error.message,
    );
    return { id: existing.id, ...existing, ...payload };
  }
};

const remove = async (collectionName, id) => {
  const collection = getCollection(collectionName);
  if (!collection) {
    return true;
  }

  try {
    await collection.doc(id).delete();
    return true;
  } catch (error) {
    console.warn(
      `Erro ao remover documento ${id} em ${collectionName}:`,
      error.message,
    );
    return true;
  }
};

const deleteByField = async (collectionName, field, value) => {
  const existing = await getByField(collectionName, field, value);

  if (!existing) {
    return false;
  }

  const collection = getCollection(collectionName);
  if (!collection) {
    return true;
  }

  try {
    await collection.doc(existing.id).delete();
    return true;
  } catch (error) {
    console.warn(
      `Erro ao remover por campo em ${collectionName}:`,
      error.message,
    );
    return true;
  }
};

const getArtigosView = async () => {
  const [artigos, categorias, usuarios] = await Promise.all([
    getAll("artigos"),
    getAll("categorias"),
    getAll("usuarios"),
  ]);

  const categoriasMap = new Map(
    categorias.map((categoria) => [
      String(categoria.id_categoria || categoria.id),
      categoria,
    ]),
  );

  const usuariosMap = new Map(
    usuarios.map((usuario) => [
      String(usuario.id_usuario || usuario.id),
      usuario,
    ]),
  );

  return artigos.map((artigo) => ({
    ...artigo,
    id_artigo: artigo.id_artigo || artigo.id,
    nome_categoria:
      categoriasMap.get(String(artigo.id_categoria || ""))?.nome_categoria ||
      "",
    nome_usuario:
      usuariosMap.get(String(artigo.id_usuario || ""))?.nome_usuario || "",
  }));
};

module.exports = {
  firestore,
  getCollection,
  getAll,
  getById,
  getByField,
  query,
  create,
  update,
  updateByField,
  remove,
  deleteByField,
  getArtigosView,
};
