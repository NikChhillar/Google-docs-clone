import doc from "../schema/docSchema.js";

export const getDocument = async (id) => {
  if (id === null) return;

  const document = await doc.findById(id);

  if (document) return document;

  return await doc.create({ _id: id, data: "" });
};

export const updateDocument = async (id, data) => {
  return await doc.findByIdAndUpdate(id, { data });
};
