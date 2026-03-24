const express = require('express');
const { supabase } = require('../db');
const router = express.Router();

// GET /api/facilities - Get all facilities
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('score', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/facilities/:id - Get single facility
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: 'Facility not found' });
      throw error;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
