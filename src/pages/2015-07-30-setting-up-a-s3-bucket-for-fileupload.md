---
title: Setting up a S3 bucket for file upload
slug: setting-up-a-s3-bucket-for-fileupload
date: 2015-07-30T12:23:30.349Z
---

Amazon has great products, and S3 is definitely one great product. However, the administration console is confusing at best. You can do anything in a lot of different ways and still it takes some fiddling to make it work.

Assuming you have an account, otherwise you should create one. You get some free stuff to play around with. Enough to have some fun with. 

- Sign into the administration console [here.](https://console.aws.amazon.com) 
- Create an s3 bucket.

When you have a bucket you need a way to access it from your client. You can use the API with the root credentials, but it is risky. If someone gets hold of them they can do anything. And obviously you will be charged for it. Amazon provides a way to grant limited access to a user. That way the user can only modify that bucket and for example not spin up 10 compute instances and do some bitcoin mining. 

Amazon calls these sub-accounts __'IMA'__. Let's create one. 

Create IMA from the [console](https://console.aws.amazon.com/iam/). You should save the credentials since you can never access them again. If you lose them you will have to generate new ones.

An IMA is per default not allowed to do anything, not even sign in. If you give the user a password you can try your policies via the web interface. That is convenient and speeds it up a bit. 

# Create a policy
Amazon grants and blocks permissions with policies. They can be used to give a user permission to an entire bucket or a single file. 

> A tip is to create the policies in small increments. It makes it way easier to debug what is happening. If you sign in you can try it out from the Web interface. 

Assuming we have an IMA that can sign in, we should allow it to list all buckets.

```
{
    "Version": "2015-07-17",
    "Statement": [
        {
            "Sid": "AllowGroupToSeeBucketListInTheConsole",
            "Action": [
                "s3:ListAllMyBuckets"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::*"
            ]
        }
    ]
}
```

This is a policy that allows the user to list all buckets. Make sure you name it.
To activate it you should attach it to a user.

To __attach it__ to a user:

- Go to the IMA dashboard 
- Click __user__. 
- Select your new IMA user.
- Attach policy
- Select the policy you created before.

When you sing in as the IMA user you created and attached the policy to, you will be able to list all buckets. Hopefully, you have buckets to list.

If you try to upload a file from the web GUI you will notice that you are not allowed to do so. Since everything is blocker per default and the policy only allows listing of buckets via the action `"s3:ListAllMyBuckets"`. You can add more actions to the list or create new blocks for other actions. For the listing of buckets we allow it for all s3 resources via the config `"Resource": ["arn:aws:s3:::*"]`.

## Upload and read files.

We can update the policy to the following: 
```
{
    "Version": "2015-07-17",
    "Statement": [
        {
            "Sid": "AllowGroupToSeeBucketListInTheConsole",
            "Action": [
                "s3:ListAllMyBuckets"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::*"
            ]
        },
        {
         "Sid":"AllowListBucketIfSpecificPrefixIsIncludedInRequest",
         "Action":["s3:ListBucket"],
         "Effect":"Allow",
         "Resource":["arn:aws:s3:::bucketname"],
         "Condition":{
            "StringLike":{"s3:prefix":["uploads/*"]
            }
         }
      },
        {
            "Sid": "AllowUploadAndReadFilesInUploadDirectory",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::bucketname/uploads/*"
            ]
        }
    ]
}
```

This will allow the user to list files in the bucket called `bucketname` as specified in the `AllowListBucketIfSpecificPrefixIsIncludedInRequest` and upload and download files to the uploads directory as specified by `AllowUploadAndReadFilesInUploadDirectory`.

Good, we are done. You can try it out from the web GUI again, as the same policies apply to both API access and web access.

Start coding and use the credentials you saved before or create new ones. You should rotated credentials often.

## Policy simulator

There is a tool called policy simulator provided by Amazon. It has the potential to be useful but I did not find it that useful. However for completeness you should try it out. 

- IAM console: https://console.aws.amazon.com/iam
- Click user in left menu
- Click simulate policy 

## S3 access with Elixir.
You should read this [awesome post](http://blog.jordan-dimov.com/accessing-the-amazon-aws-from-elixir-using-erlcloud/) about working with S3 using [erlcloud lib](https://github.com/gleber/erlcloud) from elixir.
