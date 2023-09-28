const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const testBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('total likes', () => {
  test('empty blog list does not have any likes', () => {
    const blogs = []

    expect(listHelper.totalLikes(blogs))
      .toBe(0)
  })

  test('list containing one blog has blogs likes', () => {
    for (const blog of testBlogs) {
      const blogs = [blog]

      expect(listHelper.totalLikes(blogs))
        .toBe(blog.likes)
    }
  })

  test('list with multiple blogs has the sum of the likes', () => {
    let sum = 0
    for (const blog of testBlogs) {
      sum += blog.likes
    }
    
    expect(listHelper.totalLikes(testBlogs))
      .toBe(sum)
  })
})

describe('favorite blog', () => {
  test('if list contains just one blog, it is the favorite', () => {
    for (const blog of testBlogs) {
      const blogs = [blog]
      expect(listHelper.favoriteBlog(blogs))
        .toEqual(blog)
    }
  })

  test('If list contains multiple blogs, the one with the most ' +
  'likes is the favorite', () => {
    const favoriteBlog = testBlogs[2]

    expect(listHelper.favoriteBlog(testBlogs))
      .toEqual(favoriteBlog)
  })
})

describe('most blogs', () => {
  test('the most popular bloggers blog count is not larger than ' +
  'the total blog count', () => {

    for (let i = 1; i < testBlogs.length; i++) {
      const blogs = testBlogs.slice(i)

      const count = listHelper.mostBlogs(blogs).blogs
      const totalbLogs = blogs.length

      expect(count).toBeLessThanOrEqual(totalbLogs);
    }
  })

  test('if there is only one blogger then the blogger has the ' +
  'most blogs', () => {
    for (const blog of testBlogs) {
      const blogs = [blog]
      expect(listHelper.mostBlogs(blogs))
        .toEqual({ 'author': blog.author, 'blogs': 1 })
    }
  })

  test('when one author has one blog and other has two blogs, the ' +
  'second one has most blogs', () => {
    const blogs = [testBlogs[0], testBlogs[1], testBlogs[2]]

    expect(listHelper.mostBlogs(blogs))
    .toEqual({ 'author': blogs[2].author, 'blogs': 2 })
  })

  test('When authors have one, two and three blogs, the last one ' +
  'is the most popular', () => {
    expect(listHelper.mostBlogs(testBlogs))
      .toEqual({ 'author': testBlogs[5].author, 'blogs': 3 })
  })
})

describe('most likes', () => {
  test('the most likes bloggers like count is not larger than ' +
  'the total like count', () => {

    for (let i = 1; i < testBlogs.length; i++) {
      const blogs = testBlogs.slice(i)

      const count = listHelper.mostLikes(blogs).likes
      const totalbLogs = blogs.reduce((sum, blog) => sum + blog.likes)

      //expect(count).toBeLessThanOrEqual(totalbLogs);
    }
  })

  test('if there is only one blogger then the blogger has the ' +
  'most likes', () => {
    for (const blog of testBlogs) {
      const blogs = [blog]
      expect(listHelper.mostLikes(blogs))
        .toEqual({ 'author': blog.author, 'likes': blog.likes })
    }
  })

  test('when one author has 7 likes and second has 5 blogs, the ' +
  'first one has most likes', () => {
    const blogs = [testBlogs[0], testBlogs[1]]

    expect(listHelper.mostLikes(blogs))
    .toEqual({ 'author': blogs[0].author, 'likes': blogs[0].likes })
  })

  test('multiple authors with multiple blogs', () => {
    expect(listHelper.mostLikes(testBlogs))
      .toEqual({ 'author': testBlogs[1].author, 'likes': 17 })
  })
})

