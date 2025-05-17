import boto3
from .constants import COGNITO_REGION, APP_CLIENT_ID, USER_POOL_ID, COGNITO_REDIRECT_URI, COGNITO_DOMAIN, COGNITO_TOKEN_ENDPOINT
from mypy_boto3_cognito_idp import CognitoIdentityProviderClient
import logging
import urllib
import requests

logger = logging.getLogger(__name__)


class CognitoClient:
    def __init__(self, **kwargs):
        # tells python that the client is a cognito client
        self.client: CognitoIdentityProviderClient

        # the client that is used to interact with cognito
        # this sends the requests
        self.client = boto3.client(
            "cognito-idp", region_name=COGNITO_REGION, **kwargs)

        self.default_error = {"error": "COGNITO_ERROR",
                              "message": "An error occured with cognito"}

    # here we are making a request to cognito
    # cognito will take the username as the email
    # you also specify that cognito will have an email field
    # its a bit confusing but its basically doing
    # username=email, email=email
    # we store the other data (like the actual username) in our db
    def sign_up(self, email: str, password: str):
        """
        Signs up the user to cognito user pool

        Args:
            email (str): the email of the user to be created (acts as cognito username)
            password (str): the password of the user to be created

        Returns:
            dict: The Cognito sign-up response if successful, or an error dict
        """
        try:
            response = self.client.sign_up(
                ClientId=APP_CLIENT_ID,
                Username=email,
                Password=password,
                UserAttributes=[{"Name": "email", "Value": email}],
            )
            return response
        except self.client.exceptions.UsernameExistsException:
            return {"error": "EMAIL_EXISTS", "message": "A user with this email already exists"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def login(self, email: str, password: str):
        """
        Logs the user in

        Args:
            email (str): the email of the user to be logged in
            password (str): the password of the user

        Returns:
            dict:
                On success, A cognito login response object.
                On failure, returns a dictionary with an "error" key indicating the reason:
                    - {"error": "INCORRECT_DETAILS", "message": "..."}
                    - {"error": "CONFIRM_ACCOUNT", "message": "..."}
                    - {"error": "COGNITO_ERROR", "message": "..."}

            See: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-idp/client/initiate_auth.html
        """
        try:
            response = self.client.initiate_auth(
                ClientId=APP_CLIENT_ID,
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": email,
                    "PASSWORD": password
                }
            )
            return response
        except self.client.exceptions.NotAuthorizedException:
            return {"error": "INCORRECT_DETAILS", "message": "Invalid credentials"}
        except self.client.exceptions.UserNotConfirmedException:
            return {"error": "CONFIRM_ACCOUNT", "message": "User has not confirmed their account"}
        except self.client.exceptions.UserNotFoundException:
            return {"error": "INCORRECT_DETAILS", "message": "Invalid Credentials"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def admin_confirm(self, email: str):
        """
        Confirms a user's account without the need of a sign up code

        TODO:
            - Only allow admin users to be able to do this

        Args:
            email (str): the email of the user to be confirmed

        Returns:
            dict:
                On success, nothing
                On failure, returns a dictionary with an "error" key indicating the reason:
                    - {"error": "COGNITO_ERROR", "message": "..."}
                    - {"error": "USER_NOT_FOUND", "message": "..."}
        """
        try:
            self.client.admin_confirm_sign_up(
                UserPoolId=USER_POOL_ID,
                Username=email,
            )
            return None
        except self.client.exceptions.UserNotFoundException:
            return {"error": "USER_NOT_FOUND", "message": "User does not exist"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def confirm_account(self, email: str, code: str):
        """
        Confirms a user's account with a sign up code

        Args:
            email (str): The email of the user to be confirmed
            code (str): the verification code

        Returns:
            dict:
                On success, nothing
                On failure, returns a dictionary with an "error" key indicating the reason:
                    - {"error": "COGNITO_ERROR", "message": "..."}
                    - {"error": "USER_NOT_FOUND", "message": "..."}
        """
        try:
            self.client.confirm_sign_up(
                ClientId=APP_CLIENT_ID,
                Username=email,
                ConfirmationCode=code
            )
            return None
        except self.client.exceptions.UserNotFoundException:
            return {"error": "USER_NOT_FOUND", "message": "User does not exist"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def delete_user(self, access_token: str):
        """
        Deletes a user's account

        Args:
            access_token (str): The access token for the user

        Returns:
            dict:
                On success, nothing
                On failure, returns a dictionary with an "error" key indicating the reason:
                    - {"error": "COGNITO_ERROR", "message": "..."}
                    - {"error": "USER_NOT_FOUND", "message": "..."}
        """
        try:
            self.client.delete_user(
                AccessToken=access_token
            )
            return None
        except self.client.exceptions.UserNotFoundException:
            return {"error": "USER_NOT_FOUND", "message": "User does not exist"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def refresh_tokens(self, refresh_token: str):
        """
        Refreshes the idToken and accessToken for a user

        Args:
            refresh_token (str): The refresh token for the user

        Returns:
            dict:
                On success, returns a cognito AuthenticationResult dict
                On failure, returns a dictionary with an "error" key indicating the reason:
                    - {"error": "COGNITO_ERROR", "message": "..."}
                    - {"error": "USER_NOT_FOUND", "message": "..."}
        """
        try:
            response = self.client.get_tokens_from_refresh_token(
                RefreshToken=refresh_token,
                ClientId=APP_CLIENT_ID
            )

            return response.get("AuthenticationResult")
        except self.client.exceptions.UserNotFoundException:
            return {"error": "USER_NOT_FOUND", "message": "User does not exist"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def resend_code(self, email: str):
        """
        Resends the confirmation code to the user

        Args:
            email (str): The email for the user that needs a new code

        Returns:
            dict:
                On success, returns a dict containing code delivery details
                On failure, returns a dictionary with an "error" key indicating the reason:
                    - {"error": "COGNITO_ERROR", "message": "..."}
                    - {"error": "USER_NOT_FOUND", "message": "..."}
        """
        try:
            response = self.client.resend_confirmation_code(
                ClientId=APP_CLIENT_ID,
                Username=email
            )
            return response
        except self.client.exceptions.UserNotFoundException:
            return {"error": "USER_NOT_FOUND", "message": "User does not exist"}
        except Exception as e:
            logger.error(e)
            return self.default_error

    def build_url(self):
        base_url = f"{COGNITO_DOMAIN}/oauth2/authorize"
        params = {
            "identity_provider": "Google",
            "response_type": "code",
            "client_id": APP_CLIENT_ID,
            "redirect_uri": COGNITO_REDIRECT_URI,
            "scope": "email openid profile",
        }

        url = f"{base_url}?{urllib.parse.urlencode(params)}"

        return url

    def handle_oauth_callback(self, code: str):
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "client_id": APP_CLIENT_ID,
            "redirect_uri": COGNITO_REDIRECT_URI
        }

        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        response = requests.post(COGNITO_TOKEN_ENDPOINT, data=data, headers=headers)

        if response.status_code != 200:
            return {"error": "EXCHANGE_FAILED", "message": response.json()}

        tokens = response.json()

        return tokens
