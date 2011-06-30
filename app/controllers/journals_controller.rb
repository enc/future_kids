class JournalsController < ApplicationController

  # this filter has to run before cancan resource loading
  before_filter :prepare_params, :except => :index

  inherit_resources
  belongs_to :kid
  load_and_authorize_resource


  def create
    create!{ kid_url(resource.kid) }
  end
  
protected

  # before giving cancan the control over the resource loading we influence
  # the created / built resource by adding some parameters to the params
  # hash
  def prepare_params
    params[:journal] ||= {}
    # for mentors we overwrite the mentor_id paramenter to assure that they
    # do not create entries for other mentors
    if current_user.is_a?(Mentor)
      params[:journal][:mentor_id] = current_user.id
    end
  end

end
