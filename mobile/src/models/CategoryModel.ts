import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Category } from '../types/Category';

export class CategoryModel {
  private collectionRef = collection(db, 'categories');

  // Guardar una nueva categoría en Firebase
  public async addCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    try {
      const newCategory = {
        ...categoryData,
        createdAt: Date.now(),
      };
      const docRef = await addDoc(this.collectionRef, newCategory);
      return { id: docRef.id, ...newCategory };
    } catch (error) {
      console.error("Error añadiendo la categoría: ", error);
      throw error;
    }
  }

  // Obtener las categorías desde Firebase filtradas por userId
  public async getCategories(userId: string): Promise<Category[]> {
    try {
      const q = query(
        this.collectionRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() } as Category);
      });
      return categories;
    } catch (error) {
      console.error("Error obteniendo las categorías: ", error);
      throw error;
    }
  }
}
