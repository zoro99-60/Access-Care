const express = require('express');
const { supabase } = require('../db');

const router = express.Router();

// ── POST /api/auth/register ──────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRole = role || 'patient';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: userRole }
      }
    });

    if (authError) return res.status(400).json({ message: authError.message });

    res.status(201).json({
      token: authData.session?.access_token,
      user: { 
        id: authData.user.id, 
        name, 
        email: authData.user.email, 
        role: userRole 
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Supabase Auth Signin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      // ── Demo Fallback ────────────────────────────────
      const demoUsers = {
        'patient@demo.com': { name: 'Patient User', role: 'patient' },
        'doctor@demo.com': { name: 'Dr. Doctor', role: 'doctor' },
        'hospital@demo.com': { name: 'City Hospital', role: 'hospital' },
        'admin@demo.com': { name: 'System Admin', role: 'admin' },
      };

      if (demoUsers[email] && password === 'demo1234') {
        return res.json({ 
          token: 'demo_token_' + Date.now(), 
          user: { id: 'demo-' + email, email, ...demoUsers[email] } 
        });
      }
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Fetch extra user data
    const { data: userData } = await supabase
      .from('app_users')
      .select('name, role')
      .eq('id', authData.user.id)
      .single();

    res.json({
      token: authData.session?.access_token,
      user: { 
        id: authData.user.id, 
        name: userData?.name || authData.user.user_metadata.name || 'User', 
        email: authData.user.email, 
        role: userData?.role || authData.user.user_metadata.role || 'patient' 
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) return res.status(401).json({ message: 'Invalid or expired token.' });

    const { data: userData } = await supabase
      .from('app_users')
      .select('name, role')
      .eq('id', user.id)
      .single();

    res.json({ user: { id: user.id, name: userData?.name, email: user.email, role: userData?.role } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
