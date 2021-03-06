from config import config
import suggestify.Settings as Settings

from FlickrApp.Handlers import FlickrAppRequest

import logging

class Request (FlickrAppRequest) :

    def __init__ (self, min_perms='read') :

        # This is really dumb since config gets stored
        # globally and is instantly reset everytime
        # someone calls any of the 'write' handlers which
        # is why the define 'read' above even though it's
        # in the bloody config (until it's not). This
        # needs to be cleaned up and fixed...
        
        if min_perms :
            config['flickr_minperms'] = min_perms
            
        FlickrAppRequest.__init__(self, config)

        logging.basicConfig(level=logging.INFO)

        self.settings = None
        
    def check_logged_in (self, min_perms) :

        if not FlickrAppRequest.check_logged_in(self, min_perms) :
            return False

        settings = Settings.get_settings_for_user(self.user.nsid)
        self.settings = settings
        
        return True
      
    def default_geoperms (self) :

        method = 'flickr.prefs.getGeoPerms'
        args = {'auth_token' : self.user.token}                 
        ttl = (60 * 60 * 24) * 1
        
        rsp = self.proxy_api_call(method, args, ttl)

        if rsp and rsp['stat'] == 'ok' :
            return rsp['person']['geoperms']

        return None
    
    def log (self, msg, level='info') :

        try :
            getattr(logging, level)("[suggestify] %s" % msg)
        except Exception, e:
            logging.error("Can't even log messages! Tried to %s (with %s) and got: " % (level, msg, e))
