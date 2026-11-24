from app.core.database import session_factory


class UnitOfWork:
    def __init__(self, factory=session_factory):
        self.factory = factory

    def __enter__(self):
        self.session = self.factory()
        return self

    def __exit__(self, error_type, _error, _traceback):
        try:
            if error_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        except Exception:
            self.session.rollback()
            raise
        finally:
            self.session.close()
