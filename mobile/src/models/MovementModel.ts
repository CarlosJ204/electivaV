import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Movement } from '../types/Movement';
import type { QueryConstraint } from 'firebase/firestore';
import { MovementFilter } from '../types/MovementFilter';

export class MovementModel {
  private collectionRef = collection(db, 'movements');

  // Guardar un nuevo movimiento en Firebase
  public async addMovement(movementData: Omit<Movement, 'id' | 'createdAt'>): Promise<Movement> {
    try {
      const newMovement = {
        ...movementData,
        createdAt: Date.now(),
      };
      const docRef = await addDoc(this.collectionRef, newMovement);
      return { id: docRef.id, ...newMovement };
    } catch (error) {
      console.error("Error añadiendo el movimiento: ", error);
      throw error;
    }
  }

  // Obtener los movimientos desde Firebase filtrados por userId
  public async getMovements(userId: string): Promise<Movement[]> {
    try {
      const q = query(
        this.collectionRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const movements: Movement[] = [];
      querySnapshot.forEach((doc) => {
        movements.push({ id: doc.id, ...doc.data() } as Movement);
      });
      return movements;
    } catch (error) {
      console.error("Error obteniendo los movimientos: ", error);
      throw error;
    }
  }

// Obtener el historial de movimientos aplicando filtros
public async getMovementHistory(
  filter: MovementFilter
): Promise<Movement[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', filter.userId),
    ];

    if (filter.categoryId) {
      constraints.push(
        where('categoryId', '==', filter.categoryId)
      );
    }

    constraints.push(
      orderBy('date', filter.sortOrder)
    );

    const historyQuery = query(
      this.collectionRef,
      ...constraints
    );

    const querySnapshot = await getDocs(historyQuery);

    const movements: Movement[] = [];

    querySnapshot.forEach((doc) => {
      movements.push({
        id: doc.id,
        ...doc.data(),
      } as Movement);
    });

    return movements;

  } catch (error) {
    console.error(
      'Error obteniendo el historial de movimientos: ',
      error
    );

    throw error;
  }
}









 ////////////////// 
}

