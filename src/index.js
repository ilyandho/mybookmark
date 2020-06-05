const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongooseConnect = require('./utils/connectDB');
const User = require('./models/User');

// Connect to Mongoose
mongooseConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }

    return err;
  },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      if (!decodedToken) return { currentUser: null };

      const currentUser = await User.findById(decodedToken.id).populate(
        'bookmarks'
      );

      return { currentUser: currentUser.toJSON() };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
