const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const initializeFirestore = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(require("../../serviceAccount.json")),
    });
  }

  return getFirestore();
};

const firestore = initializeFirestore();

const normalizeDoc = (doc) => ({
  id: doc.id,
  ...doc.data(),
});

const getCollection = (collectionName) => firestore.collection(collectionName);

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
  const snapshot = await buildQuery(collectionName, options).get();
  return snapshot.docs.map(normalizeDoc);
};

const getById = async (collectionName, id) => {
  const snapshot = await getCollection(collectionName).doc(id).get();
  return snapshot.exists ? normalizeDoc(snapshot) : null;
};

const getByField = async (collectionName, field, value) => {
  const snapshot = await getCollection(collectionName)
    .where(field, "==", value)
    .limit(1)
    .get();

  return snapshot.empty ? null : normalizeDoc(snapshot.docs[0]);
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

  await reference.doc(documentId).set(payload);
  return { id: documentId, ...payload };
};

const update = async (collectionName, id, data) => {
  const payload = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await getCollection(collectionName).doc(id).update(payload);
  return { id, ...payload };
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

  await getCollection(collectionName).doc(existing.id).update(payload);
  return { id: existing.id, ...existing, ...payload };
};

const remove = async (collectionName, id) => {
  await getCollection(collectionName).doc(id).delete();
  return true;
};

const deleteByField = async (collectionName, field, value) => {
  const existing = await getByField(collectionName, field, value);

  if (!existing) {
    return false;
  }

  await getCollection(collectionName).doc(existing.id).delete();
  return true;
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