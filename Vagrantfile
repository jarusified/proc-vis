Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/xenial64"

  config.vm.provider "virtualbox" do |vb|
    #   # Display the VirtualBox GUI when booting the machine
    #   vb.gui = true
    #
    #   # Customize the amount of memory on the VM:
    vb.memory = "1524"
    vb.name = "proc-vis"
  end

  config.vm.network "forwarded_port", guest: 8080, host: 8000, auto_correct: true
  config.vm.provision "file", source: "/Users/jarus/.emacs.d" ,destination:"/home/ubuntu/.emacs.d"
end
