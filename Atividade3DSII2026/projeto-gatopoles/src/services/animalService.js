import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

const animalsRef = collection(db, "animals");

export async function getAnimals() {
  const snapshot = await getDocs(animalsRef);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function getAvailableAnimals() {
  const q = query(
    animalsRef,
    where("status", "==", "Disponível")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function getAnimalById(id) {
  const snapshot = await getDoc(doc(db, "animals", id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function addAnimal(animal) {
  const document = {
    nome: animal.nome,
    idade: animal.idade,
    sexo: animal.sexo,
    porte: animal.porte || "",
    descricao: animal.descricao || "",
    personalidade: animal.personalidade || "",
    fotoUrl: animal.fotoUrl || "",
    castrado: animal.castrado ?? false,
    vacinado: animal.vacinado ?? false,
    vermifugado: animal.vermifugado ?? false,
    status: animal.status || "Disponível",
    createdAt: new Date(),
  };

  const docRef = await addDoc(animalsRef, document);

  return docRef.id;
}

export async function updateAnimal(id, animal) {
  await updateDoc(doc(db, "animals", id), {
    ...animal,
    updatedAt: new Date(),
  });
}

export async function deleteAnimal(id) {
  await deleteDoc(doc(db, "animals", id));
}