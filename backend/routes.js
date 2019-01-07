const express = require('express')
const router = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const steemit = require('./steemAPI.js')


// Enable POST request body parsing
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// Login authorization
router.get('/authorize', (req, res) => {
  console.log("AUTH");
  steemit.generateAuthUrl()
    .then(url => {
      console.log("redirecting to ", url);
      res.redirect(url);
    })
    .catch(err => {
      console.log("error in authorization ", err);
    })
})

router.get('/transfer', (req, res) => {
  // steemit.generateTransferUrl(req.body.to, req.body.amount, req.body.memo)
  console.log(req.query.amount);
  var amount = req.query.amount + ' ' + req.query.type;
  console.log(amount);
  steemit.generateTransferUrl(req.query.to, amount, req.query.memo)
    .then(url => {
      console.log("redirecting to a", url);
      res.redirect(url);
    })
    .catch(err => {
      console.log("error in creating hot signing link ", err);
    })
})

// callback
// /oauthcallback
router.post('/set/token', (req, res) => {
  console.log("Setting a token");
  steemit.setToken(req.body.accessToken, req.body.username);
})


// Logout
// Use this instead: https://steemconnect.com/api/oauth2/token/revoke from frontend
router.post('/logout', (req, res) => {
  steemit.revokeToken(req.body.username);
})


// Get Token
router.get('/:user/token', (req, res) => {
  let token = steemit.checkToken();
  console.log("Token exists??: ", token)
  res.json({token: token})
})


// Get Posts
router.get('/posts', (req, res) => {
  const filter = req.query.filter;
  const tag = req.query.tag ? req.query.tag : '';

  let query = {
    tag: tag,
    limit: 5
  };
  if (req.query.start_permlink && req.query.start_author) {
    query["start_permlink"] = req.query.start_permlink,
    query["start_author"] = req.query.start_author
  }
  console.log("query is ", query);

  steemit.getPosts(filter, query)
    .then(posts => {
      console.log("Posts ", posts);
      res.json({success: true, posts: posts});
    })
    .catch(err => {
      console.log("Error in getting posts: ", err);
    })
})


// Get Post Details
router.get('/post/details', (req, res) => {
  const author = req.query.author;
  const permlink = req.query.permlink;
  steemit.openPostDetail(author, permlink)
    .then(detail => {
      console.log("Detail: ", detail);
      res.json({success: true, detail: detail});
    })
    .catch(err => {
      console.log("Error in getting post detail: ", err);
    })
})


// Get Post Voters
router.get('/post/voters', (req, res) => {
  const author = req.query.author;
  const permlink = req.query.permlink;
  steemit.openPostVotes(author, permlink)
    .then(voters => {
      console.log("Voters: ", voters);
      res.json({success: true, voters: voters});
    })
    .catch(err => {
      console.log("Error in getting post voters ", err);
    })
})


// Get Post Comments
router.get('/post/comments', (req, res) => {
  const author = req.query.author;
  const permlink = req.query.permlink;
  steemit.openPostComments(author, permlink)
    .then(comments => {
      console.log("Comments: ", comments);
      res.json({success: true, comments: comments});
    })
    .catch(err => {
      console.log("Error in getting post comments? ", err);
    })
})


// Get Followers
router.get('/:user/followers', (req, res) => {
  const username = req.params.user;
  const letter = '';
  const limit = req.query.limit;
  steemit.getFollowers(username, letter, limit)
    .then(followers => {
      console.log("Followers: ", followers);
      res.json({success: true, followers: followers});
    })
    .catch(err => {
      console.log("Error in getting followers: ", err);
    })
})

// Get Following
router.get('/:user/followings', (req, res) => {
  const username = req.params.user;
  const letter = '';
  const limit = req.query.limit;
  steemit.getFollowings(username, letter, limit)
    .then(followings => {
      console.log("Followings: ", followings);
      res.json({success: true, followings: followings});
    })
    .catch(err => {
      console.log("Error in getting followings: ", err);
    })
})

// Check Relationship
router.get('/:userA/following/:userB', (req, res) => {
  const username = req.params.userA;
  const letter = req.params.userB;
  const limit = 1;
  // is userA following userB?
  // You wanna see if you are following this follower or not
  // celia96/following/follower
  // First, get the list of your followings
  // Then, see if your follower exist in this list
  steemit.getFollowings(username, letter, limit)
    .then((followings) => {
      if (followings.length !== 0) {
        if (followings[0]["following"] === letter) {
          console.log("you are following this person");
          res.json({ following: true })
        } else {
          console.log("you ar not following this person");
          res.json({ following: false })
        }
      } else {
        console.log("you ar not following this person");
        res.json({ following: false })
      }
    })
    .catch(err => {
      console.log("Error in getting followers: ", err);
    })
})

// Get Comments made by a particular account
router.get('/:user/comments', (req, res) => {
  let query = {
    start_author: req.params.user,
    limit: 5
  }
  if (req.query.start_permlink && req.query.start_author) {
    query["start_permlink"] = req.query.start_permlink,
    query["start_author"] = req.query.start_author
  }
  steemit.getAccountComments(query)
    .then(comments => {
      console.log("Comments: ", comments);
      res.json({success: true, comments: comments});
    })
    .catch(err => {
      console.log("Error in getting account comments: ", err);
    })
})


// Get Posts made by a particular account
router.get('/:user/posts', (req, res) => {
  let query = {
    tag: req.params.user,
    limit: 5
  }
  if (req.query.start_permlink && req.query.start_author) {
    query["start_permlink"] = req.query.start_permlink,
    query["start_author"] = req.query.start_author
  }
  steemit.getAccountPosts('blog', query)
    .then(posts => {
      console.log("Posts: ", posts);
      res.json({success: true, posts: posts});
    })
    .catch(err => {
      console.log("Error in getting account posts: ", err);
    })
})

// Get Account Wallet
router.get('/:user/wallet', (req, res) => {
  steemit.getAccountWallet(req.params.user)
    .then(wallet => {
      console.log("Wallet :" , wallet);
      res.json({success: true, wallet: wallet});
    })
})

router.get('/:user/wallet/history', (req, res) => {
  const query = {
    from: req.query.from,
    to: req.query.to
  };
  steemit.getWalletHistory(req.params.user, query)
    .then(transfers => {
      console.log("Transferas :" , transfers);
      res.json({success: true, transfers: transfers});
    })
})


// Get Account Activity
router.get('/:user/activity', (req, res) => {
  const query = {
    from: req.query.from,
    to: req.query.to
  };
  steemit.getAccountActivity(req.params.user, query)
    .then(act => {
      console.log("Activities: ", act);
      res.json({success: true, activity: act});
    })
    .catch(err => {
      res.json({success: false, error: err});
    })
})

router.get('/:user/profile', (req, res) => {
  const account = req.params.user;
  steemit.getUser(account)
    .then(user => {
      res.json({success: true, user: user})
    })
    .catch(err => {
      res.json({success: false, error: err})
    })
})

router.get('/:user/profile-image', (req, res) => {
  const account = req.params.user;
  steemit.getUserImage(account)
    .then(image => {
      res.json({success: true, profile_image: image})
    })
    .catch(err => {
      res.json({success: false, error: err})
    })
})

router.get('/test/testing', (req, res) => {
  steemit.getTest()
    .then(result => {
      res.json({result: result})
    })

})


// Broadcasting: comment, vote, transfer
// These functions require access token which can be retrieved by steemit.getToken()
// Will be done from the frontend
// https://steemconnect.com/api/broadcast
// Headers Key Bearer accessToken

// VOTE example
// body:
// {
//     "operations": [
//       ["vote", {
//         "voter": "celia96",
//         "author": "siol",
//         "permlink": "test",
//         "weight": 10000
//       }]
//     ]
//  }

// COMMENT example
// body:
// {
//    "operations": [
//      ["comment", {
//        "parent_author": "siol",
//        "parent_permlink": "test",
//        "author": "celia96",
//        "permlink": parent_author + "-re-" + author + "-" + parent_permlink,
//        "title": "",
//        "body": "hello",
//        "json_metadata": ""
//      }]
//    ]
// }

// FOLLOW example
// body:
// {
//     "operations": [
//       ["custom_json", {
//         "required_auths": [],
//         "required_posting_auths": ["celia96"],
// 		    "id": "follow",
//         "json": "[\"follow\",{\"follower\":\"celia96\",\"following\":\"siol\",\"what\":[\"blog\"]}]"
//
//       }]
//     ]
//  }

// UNFOLLOW
// body:
// {
//   "operations": [
//     ["custom_json", {
//       "required_auths": [],
//       "required_posting_auths": ["celia96"],
// 		  "id": "follow",
//       "json": "[\"follow\",{\"follower\":\"celia96\",\"following\":\"siol\",\"what\":[]}]"
//
//     }]
//   ]
//  }



module.exports = router;
