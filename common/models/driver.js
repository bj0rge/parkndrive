'use strict';

module.exports = function(Driver) {




	/* #############################################################
	   ########################### HOOKS ###########################
	   ############################################################# */


  Driver.afterRemote('*.__get__habitation',function(ctx,house,next){
    // driver cannot access to the value of another driver house through API
    if(!(ctx.req.accessToken.userId == ctx.instance.id)){
      ctx.result.value='';
    }
    next();
  });

	/**
	 * DO NOT EDIT THIS
	 * Hook for using blank password on driver creation
	 */
	Driver.beforeRemote('create', function (ctx, _modelInstance_, next) {
		ctx.args.data.password = " "
		next();
	});
	/**
	 * DO NOT EDIT THIS
	 * Hook for using blank password on driver creation
	 */
	Driver.beforeRemote('login', function (ctx, _modelInstance_, next) {
		ctx.args.credentials.password = " ";
		next();
	});

};
