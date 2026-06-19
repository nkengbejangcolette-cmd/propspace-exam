import Property from '../models/Property.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/properties  (public)
// Supports filtering by city, price range, type, purpose, and free-text search.
export const getProperties = asyncHandler(async (req, res) => {
  const { city, minPrice, maxPrice, propertyType, purpose, search, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (city) filter.city = new RegExp(`^${city}$`, 'i');
  if (propertyType) filter.propertyType = propertyType;
  if (purpose) filter.purpose = purpose;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const perPage = Math.min(50, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Property.find(filter)
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Property.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.ceil(total / perPage),
  });
});

// GET /api/properties/mine  (protected)
export const getMyProperties = asyncHandler(async (req, res) => {
  const items = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ items, total: items.length });
});

// GET /api/properties/:id  (public)
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'owner',
    'username avatar email phone'
  );
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ property });
});

// POST /api/properties  (protected)
export const createProperty = asyncHandler(async (req, res) => {
  const payload = { ...req.body, owner: req.user._id };
  const property = await Property.create(payload);
  res.status(201).json({ property });
});

// PUT /api/properties/:id  (protected, author only)
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });

  // Server-side ownership check — never trust the client.
  if (property.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not allowed to modify this listing' });
  }

  const editable = [
    'title', 'description', 'price', 'purpose', 'propertyType',
    'city', 'country', 'bedrooms', 'bathrooms', 'images',
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) property[field] = req.body[field];
  });

  await property.save();
  res.json({ property });
});

// DELETE /api/properties/:id  (protected, author only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });

  if (property.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not allowed to delete this listing' });
  }

  await property.deleteOne();
  res.json({ message: 'Listing removed', id: req.params.id });
});
