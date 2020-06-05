const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Bookmark = require('./models/Bookmark');
const User = require('./models/User');
const getUrlData = require('./utils/getUrlData');

const resolvers = {
  Query: {
    urls: async () => {
      try {
        const result = await Bookmark.find().populate(
          'user favoriters hearters'
        );
        const bookmarks = await result.map((bookmark) => bookmark.toJSON());
        console.log(bookmarks[0].user);
        return bookmarks;
      } catch (e) {
        return err;
      }
    },
    url: async (_, args) => {
      if (args.id.length !== 24) {
        throw new UserInputError(`${args.id} is not a valid id`);
      }
      try {
        const url = await Bookmark.findById(args.id).populate('user');
        if (!url) {
          throw new UserInputError(`no user found with id: ${args.id} `);
        }
        return url.toJSON();
      } catch (e) {
        // if(e.message)
        console.log(e.message);
        return e;
      }
    },
    me: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw Error('You are not logged in');
      }
      return currentUser;
    },
  },
  Mutation: {
    addUrl: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new AuthenticationError('you must log in to add a url');

      try {
        const urlDetails = await getUrlData(args.url);
        if (urlDetails.code) {
          console.log('code', urlDetails.code);
        }
        const user = await User.findById(currentUser.id);

        const bookmark = new Bookmark({
          ...urlDetails,
          caption: args.caption,
          tags: args.tags,
          user: currentUser.id,
        });

        const result = await bookmark.save();
        user.bookmarks.push(result._id);
        await user.save();
        return result.toJSON();
      } catch (e) {
        console.log(e.code);
        return e;
      }

      return bookmark;
    },
    updateUrl: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new AuthenticationError('you must log in to update a url');
      const id = args.id;
      delete args.id;
      if (id.length !== 24) {
        throw new UserInputError(`${id} is not a valid id`);
      }
      try {
        const result = await Bookmark.findById(id).populate('user');
        console.log(result);
        if (!result)
          throw new UserInputError(`no bookmark with id: ${id} was found`);

        if (JSON.stringify(currentUser.id) !== JSON.stringify(result.user.id))
          throw new AuthenticationError(
            ' You are not authorized to delete this bookmark'
          );

        let newBookmark = {};
        if (args.url) {
          const urlDetails = await getUrlData(args.url);
          newBookmark = { ...urlDetails };
        }
        newBookmark = { ...newBookmark, ...args };
        const updated = await Bookmark.findByIdAndUpdate(id, newBookmark, {
          new: true,
        }).populate('user');

        return updated.toJSON();
      } catch (e) {
        return e;
      }
    },
    deleteUrl: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new AuthenticationError('you must log in to delete a url');
      if (args.id.length !== 24) {
        throw new UserInputError(`${args.id} is not a valid id`);
      }
      try {
        const result = await Bookmark.findById(args.id).populate('user');

        if (!result)
          throw new UserInputError(`no bookmark with id: ${args.id} was found`);

        if (JSON.stringify(currentUser.id) !== JSON.stringify(result.user.id))
          throw new AuthenticationError(
            ' You are not authorized to delete this bookmark'
          );

        await Bookmark.findByIdAndRemove(result.id);
        const user = await User.findById(currentUser.id);
        user.urls.pop(result.id);
        await user.save();
        return `"${result.caption || result.description}" has been deleted`;
      } catch (error) {
        return error.message;
      }
    },
    heartUrl: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new AuthenticationError('you must log in to heart a url');
      if (args.id.length !== 24) {
        throw new UserInputError(`${args.id} is not a valid id`);
      }

      try {
        const bookmark = await Bookmark.findById(args.id);
        const user = await User.findById(currentUser.id);
        if (!bookmark) {
          throw new Error(` bookmark with id: ${args.id} can not be found `);
        }

        let hearts;
        let hearters;
        let heartedBookmarks;

        if (
          user.heartedBookmarks.includes(args.id) &&
          bookmark.hearters.includes(currentUser.id)
        ) {
          heartedBookmarks = user.heartedBookmarks.filter((urlId) => {
            return JSON.stringify(urlId) !== JSON.stringify(args.id);
          });
          hearters = bookmark.hearters.filter((urlId) => {
            return JSON.stringify(urlId) !== JSON.stringify(user._id);
          });
          hearts = bookmark.hearts - 1;
        }

        if (
          !user.heartedBookmarks.includes(args.id) &&
          !bookmark.hearters.includes(currentUser.id)
        ) {
          heartedBookmarks = [...user.heartedBookmarks, args.id];
          hearters = [...bookmark.hearters, user._id];
          hearts = bookmark.hearts + 1;
        }

        const hearted = await Bookmark.findByIdAndUpdate(
          args.id,
          { hearts, hearters },
          {
            new: true,
          }
        ).populate('user hearters favoriters');
        console.log(hearted);
        await User.findByIdAndUpdate(user._id, heartedBookmarks);
        return hearted.toJSON();
      } catch (error) {
        return error.message;
      }
    },
    toggleFavorite: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new AuthenticationError('you must log in to favorite a bookmark');
      if (args.id.length !== 24) {
        throw new UserInputError(`${args.id} is not a valid id`);
      }

      try {
        const bookmark = await Bookmark.findById(args.id);
        let user = await User.findById(currentUser.id);

        if (!bookmark) {
          throw new Error(` bookmark with id: ${args.id} can not be found `);
        }

        let favoriteBookmarks;
        let favoriters;

        if (
          user.favoriteBookmarks.includes(args.id) &&
          bookmark.favoriters.includes(currentUser.id)
        ) {
          favoriteBookmarks = user.favoriteBookmarks.filter((urlId) => {
            return JSON.stringify(urlId) !== JSON.stringify(args.id);
          });
          favoriters = bookmark.favoriters.filter((urlId) => {
            return JSON.stringify(urlId) !== JSON.stringify(user._id);
          });
        }

        if (
          !user.favoriteBookmarks.includes(args.id) &&
          !bookmark.favoriters.includes(currentUser.id)
        ) {
          favoriteBookmarks = [...user.favoriteBookmarks, args.id];
          favoriters = [...bookmark.favoriters, user._id];
        }

        let toggled = await Bookmark.findByIdAndUpdate(
          bookmark._id,
          {
            favoriters,
          },
          { new: true }
        ).populate('user hearters favoriters');
        await User.findByIdAndUpdate(currentUser.id, {
          favoriteBookmarks,
        });
        return toggled.toJSON();
      } catch (error) {
        return error.message;
      }
    },

    createUser: async (_, args) => {
      const passwordHash = await bcrypt.hash(args.password, 10);

      const user = new User({
        firstname: args.firstname,
        surname: args.surname,
        username: args.username,
        password: passwordHash,
        email: args.email,
      });

      try {
        const result = await user.save();
        return result.toJSON();
      } catch (e) {
        console.log(e.code);
        return e;
      }
    },

    login: async (_, args) => {
      try {
        const result = await User.findOne({ username: args.username });
        if (!result)
          throw new UserInputError(`password and username do not match`);
        const user = await result.toJSON();
        const match = await bcrypt.compare(args.password, user.password);

        if (!match)
          throw new UserInputError(`password and username do not match`);

        return {
          token: jwt.sign(
            {
              id: user.id,
              username: user.username,
            },
            process.env.SECRET
          ),
        };
      } catch (e) {
        console.log(e.message);
        return e;
      }
    },
  },
  Url: {
    createdAt: (root) => root.createdAt.toString(),
  },
};

module.exports = resolvers;
