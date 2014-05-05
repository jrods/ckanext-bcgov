'''A CKAN plugin that enables logging into CKAN using BC IDIR Credentials.

'''
import httplib
import json
import uuid
import urllib2
from urllib2 import HTTPError
import requests
import socket
# Unfortunately we need to import pylons directly here, because we need to
# put stuff into the Beaker session and CKAN's plugins toolkit doesn't let
# us do that yet.
import pylons

import pylons.config as config
import ckan.lib.base as base
import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import ckan.lib.helpers as helpers
from ckan.common import _, c, g, request

render = base.render

class IdirVerificationError(Exception):
    '''The exception class that is raised if trying to verify a Idir
    assertion fails.

    '''
    pass
    


def user_list(context, data_dict=None):
     # Get the user name of the logged-in user.
    user_name = context['user']
    # We have the logged-in user's user name, get their user id.
    convert_user_name_or_id_to_id = toolkit.get_converter(
        'convert_user_name_or_id_to_id')
    try:
        user_id = convert_user_name_or_id_to_id(user_name, context)
    except toolkit.Invalid:
        # The user doesn't exist (e.g. they're not logged-in).
        return {'success': False,
                'msg': 'You must be logged-in to list users.'}

    return {'success': True, 'msg': 'You must be authorized to list users'}

def user_show(context, data_dict=None):

     # Get the user name of the logged-in user.
    user_name = context['user']
    try:
        print user_name
        socket.inet_aton(user_name)
        # legal
    except socket.error:
        # Not legal
        return {'success': True,
                'msg': 'You must be logged-in to list users.'}
    return {'success': True, 'msg': 'You must be authorized to list users'}
       

class IdirPlugin(plugins.SingletonPlugin):
    '''A CKAN plugin that enables logging into CKAN using IDIR.

    '''
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IAuthenticator)
    plugins.implements(plugins.IAuthFunctions)
    
    def get_auth_functions(self):
        return {'user_list': user_list}
        

    def update_config(self, config):
        '''Update CKAN's config with settings needed by this plugin.

        '''
        toolkit.add_template_directory(config, 'templates')
        toolkit.add_public_directory(config, 'public')
        toolkit.add_resource('fanstatic', 'idir')

    def login(self, error=None):
        '''Handle an attempt to login using IDIR.

        '''
        print '**** Login invoked'
        # Get the params that were posted to /user/login.
        params = toolkit.request.params
        
        if 'login' in params:
             try:                
               
                url = config.get('edc.eas.idir.login.url', False)
                print url;
                username = 'idir\\' + params['login']
                password = params['password']
                p = urllib2.HTTPPasswordMgrWithDefaultRealm()

                p.add_password(None, url, username, password)

                handler = urllib2.HTTPBasicAuthHandler(p)
                opener = urllib2.build_opener(handler)
                urllib2.install_opener(opener)


                response = urllib2.urlopen(url)


                data = json.load(response)
                print data
                if data['success'] == 'true':
                    #user = get_user(params['login'])
                    user = toolkit.get_action('user_show')(data_dict={'id': params['login']})
                    #c.user = toolkit.get_action('user_show')(data_dict={'id': params['login']})
                    #toolkit.c.user = user
                else:
                    raise IdirVerificationError(data)

                # Store the name of the verified logged-in user in the Beaker
                # sesssion store.
                pylons.session['ckanext-idir-user'] = user['name']
                print user['name']
                #pylons.session['ckanext-persona-email'] = user['email']
                pylons.session.save()
                # Try to get the item that login() placed in the session.
                user = pylons.session.get('ckanext-idir-user')
                if user:
                    # We've found a logged-in user. Set c.user to let CKAN know.
                    toolkit.c.user = user
                    helpers.redirect_to(controller='user', action='dashboard')   
                else:
					
					helpers.redirect_to(controller='user', action='login', error='You are not authorized to login') 

             except urllib2.HTTPError as e:
                 print e.code
                 print str(e)
                 if e.code == 302:
                     pass
                 else:
                     helpers.redirect_to(controller='user', action='login', error='You are not authorized to login')					

             #except Exception as e: 
                  #print str(e)
                  #print str(e.code)
                  #helpers.redirect_to(controller='user', action='login', error='An error occured. You are not authorized to login')
                  
             

                


    def identify(self):
        '''Identify which user (if any) is logged-in via idir.

        If a logged-in user is found, set toolkit.c.user to be their user name.

        '''
        # Try to get the item that login() placed in the session.
        user = pylons.session.get('ckanext-idir-user')
        if user:
            # We've found a logged-in user. Set c.user to let CKAN know.
            toolkit.c.user = user

    def _delete_session_items(self):
        import pylons
        if 'ckanext-idir-user' in pylons.session:
            del pylons.session['ckanext-idir-user']
        if 'ckanext-idir-email' in pylons.session:
            del pylons.session['ckanext-idir-email']
        pylons.session.save()

    def logout(self):
        '''Handle a logout.'''

        # Delete the session item, so that identify() will no longer find it.
        self._delete_session_items()

    def abort(self, status_code, detail, headers, comment):
        '''Handle an abort.'''

        # Delete the session item, so that identify() will no longer find it.
        self._delete_session_items()

    def no_registering(context, data_dict):
        return {'success': False, 'msg': toolkit._('''You cannot register for this
            site.''')}

    class NoSelfRegistration(plugins.SingletonPlugin):
        plugins.implements(plugins.IAuthFunctions, inherit=True)

        def get_auth_functions(self):
            return {
                'user_create': no_registering
            }


