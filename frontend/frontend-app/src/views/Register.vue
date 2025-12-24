<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Inscription</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Nom complet</label>
          <input 
            id="name"
            type="text" 
            v-model="form.name" 
            required 
            placeholder="Votre nom complet"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            type="email" 
            v-model="form.email" 
            required 
            placeholder="votre@email.com"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            id="password"
            type="password" 
            v-model="form.password" 
            required 
            placeholder="Votre mot de passe"
            class="form-input"
          >
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
        
        <p class="auth-link">
          Déjà un compte ? <router-link to="/login">Se connecter</router-link>
        </p>
      </form>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="success" class="success-message">
        Inscription réussie ! Redirection...
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      },
      loading: false,
      error: '',
      success: false
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = '';
      
      try {
        const response = await authService.register(this.form);
        this.success = true;
        
        setTimeout(() => {
          this.$emit('user-login', response.user);
          this.$router.push('/products');
        }, 2000);
        
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur d\'inscription';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 1rem;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(10px);
}

.auth-card h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.auth-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.auth-button:hover:not(:disabled) {
  background: #357ABD;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.auth-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.auth-link a {
  color: #4A90E2;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}

.error-message {
  background: #ff4757;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  background: #2ed573;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .auth-card h2 {
    font-size: 1.5rem;
  }
}
</style>