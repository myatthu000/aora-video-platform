import { Client, ID, Account, Avatars, Databases, Storage, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'localhost',
    projectId: '670b2046002d73e05e99', 
    databaseId: '670b212a00145c48071e', 
    userCollectionId: '670b213b002f34046467',
    videoCollectionId: '670b21eb0039dcd072c3',
    storageId: '670b246f003e05b5deb8',
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId
} = config

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId)
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);



export const createUser = async (email, password, username) => {

    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        )
    
        if(!newAccount) throw Error;
    
        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);
        
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );
      
        return newUser;

    }catch(error){
        return new Error(error);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
}

// Get Current user
export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        databaseId,
        userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];

      // const currentUser = await databases.listDocuments(
      //   databaseId,
      //   userCollectionId,
      // [Query.equal('accountId', currentAccount.$id)]);


      // return currentAccount;

    } catch (error) {
      
      return null;
    }
}

export async function getAllPosts(){
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )

    return posts.documents;
  } catch(error){
    throw new Error(error);
  }
}

export async function getLatestPosts(){
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt',Query.limit(7))]
    )

    return posts.documents;
  } catch(error){
    throw new Error(error);
  }
}

export async function searchPosts(query){
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title',query)]
    )

    return posts.documents;
  } catch(error){
    throw new Error(error);
  }
}

export async function getUserPosts(userId){

  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('users',userId)]
    )

    return posts.documents;
  } catch(error){
    throw new Error(error);
  }
}

export async function signOut() {
  try{
    const session = await account.deleteSession('current');

    return session;
  } catch(error){
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  // const { mimeType, ...rest } = file;
  // const asset = { type: mimeType, ...rest };
  // console.log('asset: uploadFile: ', asset)
  
  // asset 1
  const appWriteFormat = { 
    name: file.name,
    type: file.mimeType,
    size: file.size,
    uri: file.uri,
  }

  // // asset 2
  // const appWriteFormat = { 
  //   name: file.filename,
  //   type: file.mimeType,
  //   size: file.size,
  //   uri: file.uri,
  // }

  console.log('appwrite format: ', appWriteFormat)


  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      appWriteFormat
    );

    console.log('uploadedFile: ', uploadedFile.$id)

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log('uploadedFile: ', error)
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }


    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  console.log('form: ', form)

  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    console.log('urls: ', thumbnailUrl, videoUrl)

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}
