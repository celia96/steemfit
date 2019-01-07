// Using Steemit APIs
const sc2 = require('sc2-sdk');
const dsteem = require('dsteem');
var steem = require('steem');


// init steemconnect
// let api = sc2.Initialize({
//   app: process.env.CLIENT_ID, // name of the app (e.g. V-conference)
//   callbackURL: process.env.REDIRECT_URL,
//   accessToken: 'access_token',
//   scope: ['vote', 'comment', 'custom_json'],
// });

// for testing
let api = sc2.Initialize({
  app: 'demo-app', // testing with demo-app (already authorized)
  callbackURL: 'http://localhost:3000',
  accessToken: '',
  scope: ['vote', 'comment', 'custom_json', 'delete_comment'],
});


//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');


// Login
// 1. Steemconnect

// Post Detail:
// 1. author (name, profile, photo)
// 2. Steem tag (category)
// 3. createdAt
// 4. Post image
// 5. Post Body text
// 6. Post tag
// 7. Upvote(post) & Reward(get)
// 8. Bookmark(post) & Bookmarks count(get)
// 9. Number of Comments
// 10. Submit comment
// 11. Reserve Conference
// 12. Comment Filter
// 13. Comment Body text
// 14. Like Comment(upvote)(post) & Reward(get)

// User page:
// 1. List of Posts (Timeline)
// 2. Created Comments
// 3. Get Followers & Followings
// 4. Wallet
// 5. Activity
// 6. Follow a user(post)
// 7. Transfer(post) = 선물하기

// My page:
// 1. List of Posts (Timeline)
// 2. Created Comments
// 3. Get Followers & Followings
// 4. Wallet
// 5. Activity
// 6. Submit Post(post)
// 7. Conference waiting - selected => view calendar (x)


module.exports = {
  // Login & Logout

  // Generate authorization url
  generateAuthUrl: async function() {
    // get login URL
    let link = api.getLoginURL();
    console.log("Link is: ", link);
    console.log("type ", typeof link);
    return link;
  },

  generateTransferUrl: async function(to, amount, memo) {
    // get sign URL
    var link = api.sign('transfer', {
      to: to,
      amount: amount,
      memo: memo,
    });
    console.log("Link is: ", link);
    console.log("type a a", typeof link);
    return link;
  },

  // Set access token
  setToken: function(token, user) {
    console.log("token, user: ", token, user);
    api.setAccessToken(token);
    console.log("api ", api);
  },

  // revoke access token (for logout)
  revokeToken: function(account) {
    api.revokeToken(function(err, res) {
      console.log("revoking ", res);
      if (res && res.success) {
        console.log("sucess");
        access_token = null;
        steemit.setToken(null, account)
      }
    });
    return false;
  },

  // check token
  checkToken: function() {
    if (api.options.accessToken) {
      return true
    } else {
      return false
    }
  },


  // Get Post list
  getPosts: async function(filter, query) {
    console.log('Post assembled.\nFilter:', filter, '\nQuery:', query);
    let result = await client.database.getDiscussions(filter, query);
    var posts =[];
    result.forEach(post => {
      const author = post.author;
      const category = post.category;
      let image = '';
      let tags = [];
      if (post.json_metadata) {
        let json = JSON.parse(post.json_metadata);
        image = json.image ? json.image[0] : '';
        tags = json.tags ? json.tags : [];
      }
      const title = post.title;
      const body = post.body;
      const reward = post.pending_payout_value;
      const votes = post.net_votes;
      const permlink = post.permlink;
      const created = new Date(post.created).toDateString();
      const children = post.children;
      var info = {
        image: image,
        title: title,
        author: author,
        category: category,
        body: body,
        reward: reward,
        tags: tags,
        votes: votes,
        permlink: permlink,
        created: created,
        children: children
      }
      posts.push(info);
    });
    return posts;
  },


  // Get Post Details
  //get_content of the post
  openPostDetail: async function(author, permlink) {
    let detail = await client.database.call('get_content', [author, permlink]);
    const category = detail.category;
    const created = new Date(detail.created).toDateString()
    let image = '';
    let tags = [];
    if (detail.json_metadata) {
      let json = JSON.parse(detail.json_metadata);
      image = json.image ? json.image[0] : '';
      tags = json.tags ? json.tags : [];
    }
    const title = detail.title;
    const body = detail.body;
    const reward = detail.pending_payout_value;
    const children = detail.children;
    const votes = detail.net_votes;
    const voters = detail.active_votes;
    var info = {
      author: author,
      category: category,
      created: created,
      image: image,
      title: title,
      body: body,
      permlink: permlink,
      tags: tags,
      reward: reward,
      children: children,
      votes: votes,
      voters: voters
    }
    console.log("result: ", info);
    return info;
  },


  // Get Post Voters
  //get_active_votes of the post
  openPostVotes: async function(author, permlink) {
    let voters = await client.database.call('get_active_votes', [author, permlink]);
    console.log("result: ", voters);
    return voters;
  },


  // Get Post Comments
  //get_content of the post and get_content_replies
  openPostComments: async function(author, permlink) {
    let result = await client.database.call('get_content_replies', [author, permlink]);
    // console.log(result);
    comments = [];
    console.log("result ", result);
    result.forEach(comment => {
      const created = new Date(comment.created).toDateString();
      let image = '';
      if (comment.json_metadata) {
        let json = JSON.parse(comment.json_metadata);
        image = json.image ? json.image[0] : '';
      }
      const permlink = comment.permlink;
      const author = comment.author;
      const body = comment.body;
      const reward = comment.pending_payout_value;
      const children = comment.children; // number of comments
      const voters = comment.active_votes;
      const votes = comment.net_votes; // net_votes is basically "like"
      var info = {
        author: author,
        created: created,
        image: image,
        body: body,
        permlink: permlink,
        reward: reward,
        votes: votes,
        voters: voters,
        children: children
      }
      comments.push(info);
    });

    console.log("result: ", comments);
    return comments;
  },


  // Get Followers
  // Followers function
  getFollowers: async function(username, letter, limit) {
    //get list of followers
    let followerList = await client.call('follow_api', 'get_followers', [
        username,
        letter,
        'blog',
        limit,
    ]);

    console.log("Follower list: ", followerList);
    return followerList;
  },


  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Get Followings
  // Following function
  getFollowings: async function(username, letter, limit) {
    let followingList = await client.call('follow_api', 'get_following', [
        username,
        letter,
        'blog',
        limit,
    ]);

    console.log("Following list: ", followingList);
    return followingList;
  },


  // Get Account comments
  getAccountComments: async function(query) {
    // let result = await client.database.getDiscussions('comments', query);
    let result = await steem.api.getDiscussionsByCommentsAsync(query);
    console.log("result: ", result);
    var comments = [];
    result.forEach(comment => {
        const permlink = comment.permlink;
        const author = comment.author;
        const parent_author = comment.parent_author;
        const parent_permlink = comment.parent_permlink;
        const created = new Date(comment.created).toDateString();
        const body = comment.body;
        const netvotes = comment.net_votes; // likes
        var info = {
          author: author,
          permlink: permlink,
          parent_author: parent_author,
          parent_permlink: parent_permlink,
          created: created,
          body: body,
          netvotes: netvotes,
        }
        comments.push(info);
    });
    return comments;

  },

  // Get Account comments
  getAccountPosts: async function(filter, query) {
    // steem.api.getDiscussionsByAuthorBeforeDate(author, startPermlink, beforeDate, limit, function(err, result) {
    //   console.log(err, result);
    // });
    // let result = await steem.api.getDiscussionsByAuthorBeforeDateAsync(query.tag, query.start_permlink, new Date(), query.limit);

    let result = await client.database.getDiscussions(filter, query);
    console.log("Result ", result);
    var posts =[];
    result.forEach(post => {
      const author = post.author;
      const category = post.category;
      let image = '';
      let tags = [];
      if (post.json_metadata) {
        let json = JSON.parse(post.json_metadata);
        image = json.image ? json.image[0] : '';
        tags = json.tags ? json.tags : [];
      }
      const title = post.title;
      const body = post.body;
      const reward = post.pending_payout_value;
      const votes = post.net_votes;
      const permlink = post.permlink;
      const created = new Date(post.created).toDateString();
      const children = post.children;
      var info = {
        image: image,
        title: title,
        author: author,
        category: category,
        body: body,
        reward: reward,
        votes: votes,
        permlink: permlink,
        created: created,
        tags: tags,
        children: children
      }
      posts.push(info);
    });
    return posts;
  },


  // Get Account Wallet
  getAccountWallet: async function(account) {
    const query = `/@${account}`;

    let result = await client.database.getAccounts([account]);
    let accountValue = await steem.formatter.estimateAccountValue(result[0]);
    let state = await client.database.call('get_state', [query])
    console.log("result ", result);
    console.log("accountvalue ", accountValue);
    console.log("state ", state);
    let vestingShares = result[0].vesting_shares
    let totalVestingShares = state.props.total_vesting_shares;
    let totalVestingFundSteem = state.props.total_vesting_fund_steem;
    var steemPower = await steem.formatter.vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem);
    console.log("steemPower ", steemPower);
    // result.balance = STEEM
    // result.sbd_balance = STEEM DOLLARS
    // SAVINGS : result.savings_balance, result.sbd_balance

    var info = {
      accountValue: accountValue,
      steemPower: steemPower.toString(),
      steem: result[0].balance.split(" ")[0],
      steem_dollars: result[0].sbd_balance.split(" ")[0],
      savings: {
        savings_balance: result[0].savings_balance.split(" ")[0],
        sbd_balance: result[0].sbd_balance.split(" ")[0]
      }
    }

    return info;

  },

  // Get Wallet History
  getWalletHistory: async function(account, query) {
    return new Promise (function(resolve, reject) {
      steem.api.getAccountHistory(account, query.from, query.to, function (err, res) {
        if (err) {
          reject(err);
        } else {
          let transfers = res.filter( tx =>
            tx[1].op[0] === 'transfer' || tx[1].op[0] === 'claim_reward_balance' || tx[1].op[0] === 'curation_reward');
          console.log("transfers", transfers);
          resolve(transfers);
        }
      })
    })
  },

  // Get Account Activity
  getAccountActivity: async function(account, query) {
    return new Promise (function(resolve, reject) {
      steem.api.getAccountHistory(account, query.from, query.to, function (err, res) {
        if (err) {
          reject(err);
        } else {
          console.log("res", res);
          resolve(res);
        }
      })
    })
  },

  getUserImage: async function(account) {
    let result = await client.database.getAccounts([account]);
    let json = JSON.parse(result[0].json_metadata);
    let profile_image = '';
    if (json.profile) {
      let profile = json.profile;
      profile_image = profile.profile_image ? profile.profile_image : '';
    }
    return profile_image;
  },

  getUser: async function(account) {
    let result = await client.database.getAccounts([account]);
    console.log(result[0]);
    let count = await steem.api.getFollowCountAsync(account);
    let json = JSON.parse(result[0].json_metadata);
    let profile_image = '';
    let name = account;

    if (json.profile) {
      let profile = json.profile;
      profile_image = profile.profile_image ? profile.profile_image : '';
      name = profile.name ? profile.name : account;
      console.log("name ", name);
    }

    var data = {
      account: account,
      name: name,
      userData: {
        profile_image: profile_image,
        following_count: count.following_count,
        follower_count: count.follower_count
      },
      followings: [],
      followers: []
    }
    return data;
  },

  getTest: async function() {
    const name = 'celia96';
    const obj = await steem.api.getFollowCountAsync(name);
    console.log(obj);
    // steem.api.getFollowCountAsync(name, function(err, result) => {
    //
    // })
    //   .then((result) => console.log(result))
    // console.log(obj);
    // steem.api.getFollowCount(name, function(err, result) {
    //   console.log(result);
    //   follower_count = result.follower_count;
    //   console.log(follower_count);
    // })
  }

}
