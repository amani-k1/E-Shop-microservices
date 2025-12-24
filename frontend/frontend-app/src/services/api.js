import axios from 'axios';

const USER_API = 'http://localhost:3001';
const PRODUCT_API = 'http://localhost:3003'; // ⬅️ PORT 3003 maintenant
const REVIEW_API = 'http://localhost:3004';

export const authService = {
  async register(userData) {
    const response = await axios.post(`${USER_API}/api/register`, userData);
    return response.data;
  },
  
  async login(credentials) {
    const response = await axios.post(`${USER_API}/api/login`, credentials);
    return response.data;
  }
};

export const productService = {
  async getProducts() {
    const response = await axios.get(`${PRODUCT_API}/api/products`);
    return response.data;
  }
};

export const reviewService = {
  // Obtenir les avis d'un produit
  async getProductReviews(productId, page = 1, limit = 10) {
    const response = await axios.get(
      `${REVIEW_API}/api/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Obtenir les statistiques
  async getReviewStats(productId) {
    const response = await axios.get(
      `${REVIEW_API}/api/products/${productId}/reviews/stats`
    );
    return response.data;
  },

  // Créer un avis
  async createReview(productId, reviewData) {
    const response = await axios.post(
      `${REVIEW_API}/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  },

  // Vérifier si l'utilisateur a déjà reviewé
  async checkUserReview(productId, userId) {
    const response = await axios.get(
      `${REVIEW_API}/api/products/${productId}/reviews/user/${userId}`
    );
    return response.data;
  }
};
