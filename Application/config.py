# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from   decouple import config

class Config(object):

    basedir    = os.path.abspath(os.path.dirname(__file__))

    # Set up the App SECRET_KEY
    SECRET_KEY = config('SECRET_KEY', default='S#perS3crEt_007')
    SESSION_TYPE = config('SESSION_TYPE', default = 'filesystem')

    # This will create a file in <app> FOLDER
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
        config( 'DB_ENGINE'   , default='mysql'    ),
        config( 'DB_USERNAME' , default='wajid'       ),
        config( 'DB_PASS'     , default='wajid'          ),
        config( 'DB_HOST'     , default='130.237.3.249'     ),
        config( 'DB_PORT'     , default=3306            ),
        config( 'DB_NAME'     , default='OrderDeliveryScheduler' )
    )

class ProductionConfig(Config):
    DEBUG = False

    # Security
    SESSION_COOKIE_HTTPONLY  = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 3600

    # Cache
    CACHE_TYPE: 'SimpleCache'  
    CACHE_DEFAULT_TIMEOUT: 300
    #CACHE_NO_NULL_WARNING = True


    # PostgreSQL database
    #SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
    #    config( 'DB_ENGINE'   , default='postgresql'    ),
    #    config( 'DB_USERNAME' , default='appseed'       ),
    #    config( 'DB_PASS'     , default='pass'          ),
    #    config( 'DB_HOST'     , default='localhost'     ),
    #    config( 'DB_PORT'     , default=5432            ),
    #    config( 'DB_NAME'     , default='appseed-flask' )
    #)


    SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
        config( 'DB_ENGINE'   , default='mysql'    ),
        config( 'DB_USERNAME' , default='wajid'       ),
        config( 'DB_PASS'     , default='wajid'          ),
        config( 'DB_HOST'     , default='130.237.3.249'     ),
        config( 'DB_PORT'     , default=3306            ),
        config( 'DB_NAME'     , default='OrderDeliveryScheduler' )
)

class DebugConfig(Config):
    DEBUG = True
        # Cache
    CACHE_TYPE: 'SimpleCache' 
    CACHE_DEFAULT_TIMEOUT: 300
    CACHE_NO_NULL_WARNING = True
    SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
        config( 'DB_ENGINE'   , default='mysql'    ),
        config( 'DB_USERNAME' , default='wajid'       ),
        config( 'DB_PASS'     , default='wajid'          ),
        config( 'DB_HOST'     , default='130.237.3.249'     ),
        config( 'DB_PORT'     , default=3306            ),
        config( 'DB_NAME'     , default='OrderDeliveryScheduler' )
)

# Load all possible configurations
config_dict = {
    'Production': ProductionConfig,
    'Debug'     : DebugConfig
}
