# QuickShare

A simple encrypted file and text-sharing application, with web and CLI frontends.

# How it works

**Recipient signs up**

Step 1: New user jamie@jamiegregory.co.za creates an account and enters password X.

Step 2: Client generates public key from password X

Step 3: Client sends (email, public key) to server who records this as a new record in db

Step 4: Jamie must go confirm this in his email client and click the link. This link has a secret key that activates his account.

**Someone sends file to recipient**

Step 5: Sender Max (who doesn't need an account) uploads a file for recipient jamie@jamiegregory.co.za. This takes three steps: requesting the public key, then encrypting the file to that key, then uploading the file to the server.

Step 5.1: First, the client gets the public key of jamie@jamiegregory.co.za:

- GET /users/jamie@jamiegregory.co.za

    ⇒ { ..., public-key: "sad8781dhadsh18872d12qsdasd", ... }

Step 5.2: Then, the client encrypts the file to this public key

Step 5.3: Finally, the client sends the encrypted file to the server

- POST /files, {recipient: "jamie@jamiegregory.co.za", blob: "8as97d1g7dgsagyd7asd..."}

    ⇒ {id: "`asZ_7POA`", url: "s3.capetown.amazonaws.com/1hiuasiduh081hu08dha08hd08"}

**The file is now on the server, ready for Jamie to download**

Step 7: Downloader Jamie runs  `$ quickshare download asZ_7POA`.

Step 7.1: Client requests download of file

- GET /files/:id

    ⇒ {id: "asZ_7POA", checksum: "97ff0bc...", url: "s3.capetown.amazonaws.com/1hiuas..."}

- DOWNLOAD s3.capetown.amazonaws.com/1hiuasiduh081hu08dha08hd08

    ⇒ /tmp/quickshare/asZ_7POA

Step 8: CLI tool asks for Jamie's password interactively

Step 9: CLI tool uses password to decrypt downloaded file, and moves it to the current directory. 

Step 9.1: CLI tool deterministically derives private key password, and public key from private key, like how Bitcoin brain wallets are created

Step 9.2: Private key is used to decrypt downloaded file /tmp/quickshare/asZ_7POA

Step 9.3 Checksum is derived from decrypted file. If checksum matches checksum from API, decryption is considered successful and the file is moved to the current directory

## Service APIs (WIP)
The application consists of services UserService and FileService.

**UserService:** provides a verified list of public keys owned by email addresses.

- POST /users: create a new public key to email pair. This will be set as unconfirmed
    - params: (email, pubkey)
    - side effect: add record to db with (email, pubkey, confirmed: false)
    - side effect: send email with confirmation link
- GET /actions/confirm-user with query string params: set a record as confirmed (create a confirmation record?) (should ideally be a POST)
    - side effect: update confirmed: true
    - redirect to confirmed paged
- GET /users/:email: return a User, which gives their public key
    - params: email
    - response: key
    - ERROR if email is not confirmed
- DELETE /users/:email: revoke a key
    - side effect: send confirm delete email
- GET /actions/delete-user: confirm deletion request (create a confirmation record?) (should ideally be a DELETE)
    - side effect: delete record from keylist with email=email

**FileService:** allows sharing files and text
You 
- POST to /files
    - params: (recipientEmail, body, expires)
    - ERROR if recipientEmail is not confirmed or doesn't exist in KeyList
    - side effect: generate random string for secretID
    - reponse: secretID
- GET /files/:secretID
    - params: (secretID)
    - side effect: download encrypted file if `Date.now() <= expires`

## Frontends (WIP)
- CLI
- Web

**CLI:**
- Submit email, pubkey to UserService
- Take encrypted file, privateKey
