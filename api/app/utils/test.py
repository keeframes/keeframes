from Crypto.PublicKey import RSA

key = RSA.generate(2048)
private_key = key.export_key(format='PEM')  # This is PKCS#1
public_key = key.publickey().export_key(format='PEM')

with open("private.pem", "wb") as priv_file:
    priv_file.write(private_key)

with open("public.pem", "wb") as pub_file:
    pub_file.write(public_key)

