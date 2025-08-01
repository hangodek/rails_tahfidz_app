class DashboardController < ApplicationController
  def index
    user = Current.user

    render inertia: "Dashboard/Index", props: { user: user }
  end
end
