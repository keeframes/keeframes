from datetime import datetime
import functools
from .secrets import get_secret
import rsa
from botocore.signers import CloudFrontSigner


# I robbed this from github...
class CloudFrontUtil:
    def __init__(self, private_key_name, public_key_id: str):
        """
        :param private_key_name: str, the path of private key stored in aws secrets manager
        :param public_key_id: str, CloudFront -> Key management -> Public keys
        """
        self.key_id = public_key_id

        # Get PEM key string from Secrets Manager
        pem_data = get_secret(private_key_name)

        # Parse PEM into PrivateKey object
        priv_key = rsa.PrivateKey.load_pkcs1(pem_data.encode("utf-8"))

        # NOTE: CloudFront use RSA-SHA1 for signing URLs or cookies
        self.rsa_signer = functools.partial(
            rsa.sign, priv_key=priv_key, hash_method='SHA-1'
        )
        self.cf_signer = CloudFrontSigner(self.key_id, self.rsa_signer)

    def generate_presigned_url(self, url: str, expire_at: datetime) -> str:
        # Create a signed url that will be valid until the specfic expiry date
        # provided using a canned policy.
        return self.cf_signer.generate_presigned_url(url, date_less_than=expire_at)

    def generate_signed_cookies(self, url: str, expire_at: datetime) -> str:
        policy = self.cf_signer.build_policy(url, expire_at).encode('utf8')
        policy_64 = self.cf_signer._url_b64encode(policy).decode('utf8')

        signature = self.rsa_signer(policy)
        signature_64 = self.cf_signer._url_b64encode(signature).decode('utf8')
        return {
            "CloudFront-Policy": policy_64,
            "CloudFront-Signature": signature_64,
            "CloudFront-Key-Pair-Id": self.key_id,
        }
