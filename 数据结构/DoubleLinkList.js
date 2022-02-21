function DoubleLinkList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
  function Node(element) {
    this.element = element;
    this.prev = null;
    this.next = null;
  }
  DoubleLinkList.prototype.append = function(element) {
    const newNode = new Node(element);
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }
  DoubleLinkList.prototype.insert = function(position, element) {
    const newNode = new Node(element);

    if (position < 0 || position > this.length) {
      throw new Error('position error!');
    }
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else{
      if (position === 0) {
        this.head.prev = newNode;
        newNode.next = this.head;
        this.head = newNode;
      } else if (position === this.length) {
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
      } else {
        let current = this.head;
        let index = 0;
        while(index++ < position) {
          current = current.next;
        }
        newNode.prev = current.prev;
        newNode.next = current;
        current.prev.next = newNode;
        current.prev = newNode;
      }
    }
    this.length++;
    return true;
  }
  DoubleLinkList.prototype.get = function(position) {
    let index = 0;
    let current = null;
    if (position < 0 || position >= this.length) {
      throw new Error('position error!');
    }
    if (position < this.length / 2) {
      current = this.head;
      while(index++ < position) {
        current = current.next;
      }
    } else {
      current = this.tail;
      index = this.length - 1;
      while(index-- > position) {
        current = current.prev;
      }
    }
    return current.element;
  }
  DoubleLinkList.prototype.indexOf = function(element) {
    let current = this.head;
    let index = 0;
    while(current) {
      if (current.element === element) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }
  DoubleLinkList.prototype.update = function(position, element) {
    let index = 0;
    let current = null;
    if (position < 0 || position >= this.length) {
      throw new Error('position error!');
    }
    if (position < this.length / 2) {
      current = this.head;
      while(index++ < position) {
        current = current.next;
      }
    } else {
      current = this.tail;
      index = this.length - 1;
      while(index-- > position) {
        current = current.prev;
      }
    }
    current.element = element;
    return true;
  }
  DoubleLinkList.prototype.removeAt = function(position, element) {
    if (position < 0 || position >= this.length) {
      throw new Error('position error!');
    }

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      let index = 0
      let current = null;
      if (position === 0) {
        this.head = this.head.next;
        this.head.prev = null;
      } else if(position === this.length -1) {
        this.tail = this.tail.prev;
        this.tail.next = null;
      } else {
        if (position < this.length / 2) {
          current = this.head;
          while(index++ < position) {
            current = current.next;
          }
        } else {
          index = this.length - 1;
          current = this.tail;
          while(index-- > position) {
            current = current.prev;
          }
        }
        current.prev.next = current.next;
        current.next.prev = current.prev;
      }
    }
    return true;
  }
  DoubleLinkList.prototype.remove = function(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }
  DoubleLinkList.prototype.size = function() {
    return this.length;
  }
  DoubleLinkList.prototype.isEmpty = function() {
    return this.length === 0;
  }
  DoubleLinkList.prototype.forwardString = function() {
    let current = this.head;
    let result = '';
    while(current) {
      result += result === '' ? current.element : ` ${current.element}`;
      current = current.next;
    }
    return result;
  }
  DoubleLinkList.prototype.backwordString = function() {
    let current = this.tail;
    let result = '';
    while(current) {
      result += result === '' ? current.element : ` ${current.element}`;
      current = current.prev;
    }
    return result;
  }
}

let linklist = new DoubleLinkList();
linklist.append(2);
linklist.append(42);
linklist.append(23);
linklist.append(122);
linklist.append(251);
linklist.insert(5, 999)
// linklist.toString();
linklist.get(4);
linklist.update(4, 9999);
linklist.get(4);
linklist.forwardString();
linklist.removeAt(3);
linklist.backwordString();