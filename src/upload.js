const multer  = require('multer');



// uploading using multer


// const multi = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'adhaar', maxCount: 1 }, { name: 'pancard', maxCount: 1 },{name: 'profile_img', maxCount: 1 },{name: 'bank_document', maxCount: 1 }])
var limits = { fileSize: 1024 * 512 }
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file,"file")
      callback(null, './upload');
    },
    filename: function (req, file, callback) {
        console.log(1)
        const originalname=file.originalname
       const user_id=req.user.user_id;
       const fieldname=file.fieldname
       const new_file_name=user_id +'-' + fieldname + '-' + Date.now()+'-'+originalname
       req.files[`${fieldname}`]=new_file_name
    //    console.log(req.user)
    console.log(req.files,"req.files")
      callback(null, new_file_name)
    }
  });
  const upload = multer({ storage:storage,
    limits:limits,
    onError : function(err, next) {
        console.log('error', err);
        next(err);
      }
    })
    


const multi = upload.fields([{ name: 'adhardcard', maxCount: 1 },
  { name: 'pancard', maxCount: 1 },
  { name: 'bank_document', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 },
  { name: 'file', maxCount: 1 },

])

const single = upload.single("file")
module.exports.single=multi;
// module.exports.single=single;
module.exports.multi=multi;


// module.exports.single=(req,res,next)=>{

  
// try {
//     var limits = { fileSize: 1024 * 512 }
//     var storage =   multer.diskStorage({
//         destination: function (req, file, callback) {
//             console.log(file,"file")
//           callback(null, './upload');
//         },
//         filename: function (req, file, callback) {
//             console.log(1)
//            const user_id=req.user.user_id;
//            const fieldname=file.fieldname
//            const new_file_name=user_id +'-' + fieldname + '-' + Date.now()
//            req.files[`${fieldname}`]=new_file_name
//         //    console.log(req.user)
//         console.log(req.files,"req.files")
//           callback(null, new_file_name)
//         }
//       });
//       const upload = multer({ storage:storage,
//         limits:limits,
//         onError : function(err, next) {
//             console.log('error', err);
//             next(err);
//           }
//         })

//     const multi = upload.fields([{ name: 'adhardcard', maxCount: 1 },
//     { name: 'pancard', maxCount: 1 },
//     { name: 'bank_document', maxCount: 1 },
//     { name: 'profile_image', maxCount: 1 },
//     { name: 'file', maxCount: 1 },
  
//   ])

//   multi(req,res)
//   next()
// } catch (error) {
//     console.log(error);
// }


// }