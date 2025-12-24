<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <h3>Avis Clients</h3>
      <div class="reviews-summary">
        <div class="average-rating">
          <span class="rating-number">{{ stats.averageRating }}</span>
          <span class="rating-stars">★★★★★</span>
          <span class="rating-count">({{ stats.totalReviews }} avis)</span>
        </div>
        <button v-if="user" @click="showReviewForm = true" class="add-review-btn">
          ✏️ Donner mon avis
        </button>
      </div>
    </div>

    <!-- Distribution des notes -->
    <div class="rating-distribution" v-if="stats.ratingDistribution">
      <div v-for="rating in 5" :key="rating" class="rating-bar">
        <span class="rating-label">{{ 6 - rating }} ★</span>
        <div class="bar-container">
          <div 
            class="bar-fill" 
            :style="{ width: getRatingPercentage(6 - rating) + '%' }"
          ></div>
        </div>
        <span class="rating-count">{{ stats.ratingDistribution[6 - rating] || 0 }}</span>
      </div>
    </div>

    <!-- Formulaire d'avis -->
    <div v-if="showReviewForm" class="review-form-overlay">
      <div class="review-form">
        <h4>Donner votre avis</h4>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label>Note</label>
            <div class="rating-input">
              <span 
                v-for="star in 5" 
                :key="star"
                class="star"
                :class="{ active: star <= newReview.rating }"
                @click="newReview.rating = star"
              >
                ★
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Titre (optionnel)</label>
            <input v-model="newReview.title" placeholder="Titre de votre avis">
          </div>
          
          <div class="form-group">
            <label>Commentaire</label>
            <textarea 
              v-model="newReview.comment" 
              placeholder="Partagez votre expérience..."
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showReviewForm = false">Annuler</button>
            <button type="submit" :disabled="!newReview.rating">Publier</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Liste des avis -->
    <div class="reviews-list">
      <div v-for="review in reviews" :key="review._id" class="review-item">
        <div class="review-header">
          <div class="reviewer-info">
            <span class="reviewer-name">{{ review.userName }}</span>
            <span class="review-date">
              {{ formatDate(review.createdAt) }}
            </span>
          </div>
          <div class="review-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-value">{{ review.rating }}/5</span>
          </div>
        </div>
        
        <h5 v-if="review.title" class="review-title">{{ review.title }}</h5>
        <p class="review-comment">{{ review.comment }}</p>
        
        <div v-if="review.verified" class="verified-badge">
          ✅ Achat vérifié
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="reviewsData.totalPages > 1" class="reviews-pagination">
      <button 
        v-for="page in reviewsData.totalPages" 
        :key="page"
        @click="loadReviews(page)"
        :class="{ active: reviewsData.currentPage === page }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import { reviewService } from '../services/api';

export default {
  name: 'ProductReviews',
  props: {
    productId: String,
    user: Object
  },
  data() {
    return {
      reviews: [],
      stats: {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      },
      reviewsData: {},
      showReviewForm: false,
      newReview: {
        rating: 0,
        title: '',
        comment: ''
      }
    };
  },
  methods: {
    async loadReviews(page = 1) {
      try {
        this.reviewsData = await reviewService.getProductReviews(this.productId, page);
        this.reviews = this.reviewsData.reviews;
        
        // Charger les stats
        const statsData = await reviewService.getReviewStats(this.productId);
        this.stats = statsData;
      } catch (error) {
        console.error('Erreur chargement avis:', error);
      }
    },
    
    async submitReview() {
      try {
        await reviewService.createReview(this.productId, {
          ...this.newReview,
          userId: this.user.id,
          userName: this.user.name
        });
        
        this.showReviewForm = false;
        this.newReview = { rating: 0, title: '', comment: '' };
        await this.loadReviews();
        
        alert('Votre avis a été publié avec succès!');
      } catch (error) {
        console.error('Erreur publication avis:', error);
        alert('Erreur lors de la publication de l\'avis');
      }
    },
    
    getRatingPercentage(rating) {
      const count = this.stats.ratingDistribution[rating] || 0;
      const total = this.stats.totalReviews;
      return total > 0 ? (count / total) * 100 : 0;
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR');
    }
  },
  async mounted() {
    await this.loadReviews();
  },
  
  watch: {
    productId: {
      handler: 'loadReviews',
      immediate: true
    }
  }
};
</script>

<style scoped>
.product-reviews {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f3f4;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-number {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.rating-stars {
  color: #ffc107;
  font-size: 1.2rem;
}

.rating-count {
  color: #666;
}

.add-review-btn {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.rating-distribution {
  margin-bottom: 2rem;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.rating-label {
  min-width: 50px;
  color: #666;
}

.bar-container {
  flex: 1;
  background: #f1f3f4;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #ffc107;
  transition: width 0.3s ease;
}

.review-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.review-form {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star.active {
  color: #ffc107;
}

.star:hover {
  color: #ffc107;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #4A90E2;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-date {
  color: #666;
  font-size: 0.9rem;
}

.review-title {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.review-comment {
  color: #666;
  line-height: 1.5;
}

.verified-badge {
  display: inline-block;
  background: #2ed573;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.reviews-pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.reviews-pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.reviews-pagination button.active {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}
</style>