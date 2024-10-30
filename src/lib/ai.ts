import * as tf from '@tensorflow/tfjs';

// Modelo simple para predecir tiempos de entrega
class DeliveryPredictor {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Crear un modelo secuencial simple
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [3], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    // Compilar el modelo
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
  }

  async predictDeliveryTime(
    distance: number,
    trafficLevel: number,
    timeOfDay: number
  ): Promise<number> {
    if (!this.model) await this.initialize();

    // Normalizar inputs
    const normalizedInputs = tf.tensor2d([[
      distance / 50, // Normalizar distancia (asumiendo max 50km)
      trafficLevel / 10, // Nivel de tráfico (0-10)
      timeOfDay / 24 // Hora del día (0-24)
    ]]);

    const prediction = this.model!.predict(normalizedInputs) as tf.Tensor;
    const result = await prediction.data();
    
    // Convertir predicción a minutos (entre 10 y 120 minutos)
    return Math.max(10, Math.min(120, Math.round(result[0] * 110 + 10)));
  }
}

// Optimizador de rutas usando algoritmo simple
export class RouteOptimizer {
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static optimizeRoute(
    currentLocation: [number, number],
    deliveries: Array<{ lat: number; lng: number }>
  ): number[] {
    // Implementación simple del algoritmo del vecino más cercano
    const unvisited = [...deliveries];
    const route: number[] = [];
    let current = currentLocation;

    while (unvisited.length > 0) {
      let minDist = Infinity;
      let nextIndex = -1;
      let nextIndexInUnvisited = -1;

      unvisited.forEach((point, index) => {
        const dist = this.calculateDistance(
          current[0],
          current[1],
          point.lat,
          point.lng
        );
        if (dist < minDist) {
          minDist = dist;
          nextIndex = route.length;
          nextIndexInUnvisited = index;
        }
      });

      route.push(nextIndex);
      current = [unvisited[nextIndexInUnvisited].lat, unvisited[nextIndexInUnvisited].lng];
      unvisited.splice(nextIndexInUnvisited, 1);
    }

    return route;
  }
}

// Predictor de precios basado en datos históricos y condiciones actuales
export class PricePredictor {
  static predictPrice(
    distance: number,
    timeOfDay: number,
    demand: number,
    basePrice: number
  ): number {
    // Factores de ajuste
    const timeMultiplier = this.getTimeMultiplier(timeOfDay);
    const demandMultiplier = 1 + (demand / 10) * 0.5; // 0-50% extra basado en demanda
    const distanceMultiplier = 1 + (distance / 10) * 0.2; // 20% extra por cada 10km

    // Calcular precio final
    const adjustedPrice = basePrice * timeMultiplier * demandMultiplier * distanceMultiplier;
    
    // Redondear a miles
    return Math.round(adjustedPrice / 1000) * 1000;
  }

  private static getTimeMultiplier(hour: number): number {
    // Horas pico: 7-9 AM y 5-7 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 1.3; // 30% extra en horas pico
    }
    // Horas nocturnas: 10 PM - 5 AM
    if (hour >= 22 || hour <= 5) {
      return 1.5; // 50% extra en horario nocturno
    }
    return 1.0;
  }
}

export const deliveryPredictor = new DeliveryPredictor();