const { prisma } = require('../config/db');

exports.createBook = async (req, res) => {
  const { title, author, category, cover, pdf, description, rating, downloads, read_time, pages, published, featured } = req.body;
  try {
    const result = await prisma.book.create({
      data: {
        title,
        author,
        category,
        cover,
        pdf,
        description,
        rating: rating || 0,
        downloads: downloads || 0,
        read_time,
        pages: pages ? parseInt(pages, 10) : null,
        published,
        featured: featured || false
      }
    });
    res.json({ id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create book' });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, category, cover, pdf, description, rating, downloads, read_time, pages, published, featured } = req.body;
  try {
    await prisma.book.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        author,
        category,
        cover,
        pdf,
        description,
        rating,
        downloads,
        read_time,
        pages: pages ? parseInt(pages, 10) : null,
        published,
        featured
      }
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: parseInt(id, 10) }
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

exports.getBooks = async (req, res) => {
  const { search, category, featured, sort } = req.query;
  try {
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    let orderByClause = [];
    if (sort) {
      switch (sort) {
        case 'featured':
          orderByClause = [{ featured: 'desc' }, { rating: 'desc' }];
          break;
        case 'rating':
          orderByClause = [{ rating: 'desc' }];
          break;
        case 'downloads':
          orderByClause = [{ downloads: 'desc' }];
          break;
        case 'newest':
          orderByClause = [{ created_at: 'desc' }];
          break;
        case 'title':
          orderByClause = [{ title: 'asc' }];
          break;
        default:
          orderByClause = [{ featured: 'desc' }, { rating: 'desc' }];
      }
    } else {
      orderByClause = [{ featured: 'desc' }, { rating: 'desc' }];
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      orderBy: orderByClause
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categoriesGroup = await prisma.book.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });
    
    const allBooksCount = await prisma.book.count();
    
    const categories = categoriesGroup.map(c => ({
      id: c.category,
      name: c.category,
      count: c._count.category
    }));
    
    const result = [
      { id: 'all', name: 'All Books', count: allBooksCount },
      ...categories
    ];
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id, 10) }
    });
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};
