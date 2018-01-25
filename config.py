'''project configuration program'''
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    '''base config'''
    SECRET_KEY = os.environ.get('SECRET_KEY_FAKEGRAFANA') or 'hinoc key that cannot guess'
    BOOTSTRAP_SERVE_LOCAL = True

    @staticmethod
    def init_app(app):
        '''initial application'''
        pass


class DevelopmentConfig(Config):
    '''configuration which development use'''
    pass


class ProductionConfig(Config):
    '''production config which production use'''
    pass


class TestConfig(Config):
    '''test config which test use'''
    pass


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'test': TestConfig,
    'default': DevelopmentConfig
}